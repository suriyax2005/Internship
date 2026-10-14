import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyEmailToken, devVerifyUser } from '../../store/slices/authSlice';
import api from '../../api/axiosInstance';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  ArrowRight,
  RefreshCw,
  Zap,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const routeParams = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const token = routeParams.token || searchParams.get('token');
  const initialEmail = searchParams.get('email') || location.state?.email || '';

  const [activeVerificationUrl, setActiveVerificationUrl] = useState(location.state?.verificationUrl || null);
  const [activePreviewUrl, setActivePreviewUrl] = useState(location.state?.previewUrl || null);

  // If a token is provided in URL, we start in 'verifying' state.
  // If no token is provided but we have an email or dev link, we start in 'pending' state.
  // Otherwise, we start in 'enter_email' state so the user can enter their email to get a link.
  const [status, setStatus] = useState(() => {
    if (token) return 'verifying';
    if (initialEmail) return 'pending';
    return 'enter_email';
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState(initialEmail);
  const [resending, setResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [userRole, setUserRole] = useState('LANDLORD');
  const [isDevVerifying, setIsDevVerifying] = useState(false);

  useEffect(() => {
    if (!token) {
      if (initialEmail) {
        setStatus('pending');
      } else {
        setStatus('enter_email');
      }
      return;
    }

    let isMounted = true;
    setStatus('verifying');

    const verify = async () => {
      try {
        const res = await dispatch(verifyEmailToken(token));
        if (verifyEmailToken.fulfilled.match(res)) {
          if (isMounted) {
            setStatus('success');
            const role = res.payload.user?.role || 'LANDLORD';
            setUserRole(role);
            setTimeout(() => {
              if (role === 'TENANT') {
                navigate('/tenant/dashboard');
              } else {
                navigate('/dashboard');
              }
            }, 3000);
          }
        } else {
          if (isMounted) {
            setStatus('error');
            setErrorMessage(res.payload || 'Invalid or expired verification link.');
          }
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage('Unable to verify email at this moment. Please try again.');
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, dispatch, navigate, initialEmail]);

  const handleDevInstantVerify = async (targetEmail) => {
    const emailToUse = targetEmail || resendEmail || initialEmail;
    if (!emailToUse) {
      toast.error('Email address is missing');
      return;
    }

    setIsDevVerifying(true);
    try {
      const res = await dispatch(devVerifyUser(emailToUse.trim()));
      if (devVerifyUser.fulfilled.match(res)) {
        setStatus('success');
        const role = res.payload.user?.role || 'LANDLORD';
        setUserRole(role);
        setTimeout(() => {
          if (role === 'TENANT') {
            navigate('/tenant/dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 2500);
      }
    } finally {
      setIsDevVerifying(false);
    }
  };

  const handleResend = async (e) => {
    if (e) e.preventDefault();
    const emailToUse = (resendEmail || initialEmail || '').trim();
    if (!emailToUse) {
      toast.error('Please enter your email address');
      return;
    }

    setResending(true);
    try {
      const res = await api.post('/auth/resend-verification', { email: emailToUse });
      const data = res.data?.data;
      setResendSent(true);

      if (data?.verificationUrl) {
        setActiveVerificationUrl(data.verificationUrl);
      }
      if (data?.previewUrl) {
        setActivePreviewUrl(data.previewUrl);
      }

      toast.success(res.data?.message || 'Verification link generated!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend verification link.';
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      {/* 1. Pending Email Check (User just registered or has an email) */}
      {status === 'pending' && (
        <div className="space-y-5 py-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Mail className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Check your inbox</h2>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              We've created your account and dispatched verification details for{' '}
              <span className="text-white font-semibold">{initialEmail || resendEmail}</span>.
            </p>
          </div>

          {/* Dev Mode Instant Activation Banner */}
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-brand-500/30 text-left space-y-3.5 shadow-xl shadow-brand-500/5">
            <div className="flex items-center space-x-2 text-brand-400">
              <Zap className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Development Mode — Instant Verification
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In local development without external SMTP setup, emails are logged to the backend console. You can verify and activate your account instantly below:
            </p>

            <button
              onClick={() => handleDevInstantVerify(initialEmail || resendEmail)}
              disabled={isDevVerifying}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isDevVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Activating Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>⚡ Instant Activate & Log In Now</span>
                </>
              )}
            </button>

            {/* Direct Verification Link (if available) */}
            {activeVerificationUrl && (
              <div className="pt-2 border-t border-slate-700/60">
                <p className="text-[11px] text-slate-400 mb-1 font-medium">Or click the generated link:</p>
                <a
                  href={activeVerificationUrl}
                  className="text-xs text-brand-400 hover:text-brand-300 break-all transition font-mono underline block"
                >
                  {activeVerificationUrl}
                </a>
              </div>
            )}

            {/* Ethereal Inbox Preview (if available) */}
            {activePreviewUrl && (
              <div className="pt-2 border-t border-slate-700/60">
                <a
                  href={activePreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <span>Open simulated email preview on Ethereal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          <div className="pt-2 space-y-2">
            <p className="text-xs text-slate-500">Need a fresh link or entered the wrong email?</p>
            <button
              onClick={() => setStatus('enter_email')}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium transition"
            >
              Resend verification email or change address →
            </button>
          </div>
        </div>
      )}

      {/* 2. Loading State — token being verified */}
      {status === 'verifying' && (
        <div className="space-y-4 py-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Verifying your email</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Please wait a moment while we validate your security link and activate your Dwellora account...
          </p>
        </div>
      )}

      {/* 3. Success State */}
      {status === 'success' && (
        <div className="space-y-5 py-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Email Verified!</h2>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your email has been successfully confirmed and your account is now fully active.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400">
            Redirecting you to your dashboard in moments...
          </div>

          <button
            onClick={() => {
              if (userRole === 'TENANT') {
                navigate('/tenant/dashboard');
              } else {
                navigate('/dashboard');
              }
            }}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all"
          >
            <span>Go to Dashboard Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Error / Expired State */}
      {status === 'error' && (
        <div className="space-y-5 py-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <XCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Verification Failed</h2>
            <p className="text-sm text-red-300/90 max-w-sm mx-auto leading-relaxed">
              {errorMessage}
            </p>
          </div>

          {/* Quick Resend / Instant Verify Box */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left space-y-3">
            <p className="text-xs font-semibold text-slate-300">Request a new verification link</p>
            <form onSubmit={handleResend} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="submit"
                  disabled={resending}
                  className="py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Send New Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDevInstantVerify(resendEmail)}
                  disabled={isDevVerifying || !resendEmail}
                  className="py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isDevVerifying ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                  <span>⚡ Dev Activate</span>
                </button>
              </div>
            </form>

            {activeVerificationUrl && (
              <div className="pt-2 border-t border-slate-700/60">
                <p className="text-[11px] text-amber-400 font-semibold mb-1">Generated link:</p>
                <a
                  href={activeVerificationUrl}
                  className="text-xs text-brand-400 hover:text-brand-300 break-all transition font-mono underline block"
                >
                  {activeVerificationUrl}
                </a>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link
              to="/login"
              className="text-xs text-brand-400 hover:text-brand-300 font-medium transition"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      )}

      {/* 5. Enter Email State (Visited /verify-email directly without token or state) */}
      {status === 'enter_email' && (
        <div className="space-y-5 py-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Mail className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Verify Your Account</h2>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Enter your registered email address below to activate your account or request a verification link.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left space-y-3">
            <form onSubmit={handleResend} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter your registered email address"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="submit"
                  disabled={resending}
                  className="py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Get Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDevInstantVerify(resendEmail)}
                  disabled={isDevVerifying || !resendEmail}
                  className="py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isDevVerifying ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                  <span>⚡ Instant Activate</span>
                </button>
              </div>
            </form>

            {activeVerificationUrl && (
              <div className="pt-2 border-t border-slate-700/60">
                <p className="text-[11px] text-amber-400 font-semibold mb-1">Generated link:</p>
                <a
                  href={activeVerificationUrl}
                  className="text-xs text-brand-400 hover:text-brand-300 break-all transition font-mono underline block"
                >
                  {activeVerificationUrl}
                </a>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link
              to="/login"
              className="text-xs text-brand-400 hover:text-brand-300 font-medium transition"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
