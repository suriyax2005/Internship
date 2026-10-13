import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  KeyRound,
  Send,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const emailValue = watch('email', '');

  /* Email validation */
  const validateEmail = useCallback((value) => {
    if (!value) return 'Email address is required';
    if (/\s/.test(value)) return 'Email cannot contain spaces';
    if (/@@/.test(value)) return 'Invalid email — double @ detected';
    if (value.startsWith('@')) return 'Email cannot start with @';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    // Gmail-specific checks
    if (value.toLowerCase().endsWith('@gmail.com')) {
      const localPart = value.split('@')[0];
      if (/\.\./.test(localPart)) return 'Gmail addresses cannot have consecutive dots';
      if (localPart.startsWith('.') || localPart.endsWith('.'))
        return 'Gmail addresses cannot start or end with a dot';
    }
    return true;
  }, []);

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    setServerError('');
    try {
      await api.post('/auth/forgot-password', data);
      setSubmittedEmail(data.email);
      setSubmitted(true);
      toast.success('Password reset link sent');
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong. Please try again.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Success State ── */
  if (submitted) {
    return (
      <div className="space-y-6">
        {/* Success animation */}
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="relative">
            {/* Pulse rings */}
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-emerald-500/20 animate-pulse-ring" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-brand-500 to-emerald-400 rounded-full flex items-center justify-center animate-scale-in shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Check your inbox</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
              We sent a password reset link to{' '}
              <span className="text-white font-medium">{submittedEmail}</span>. It will expire in 30 minutes.
            </p>
          </div>

          {/* Tips */}
          <div className="w-full p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Didn't receive the email? Check your spam folder, or make sure you entered the correct email address.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
            <Link
              to="/login"
              className="flex items-center justify-center space-x-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl border border-slate-700 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form State ── */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3 fade-in-up">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-500/20 to-emerald-400/20 border border-brand-500/20 flex items-center justify-center">
          <KeyRound className="w-6 h-6 text-brand-400" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-[26px] font-black text-white tracking-tight">
            Forgot your password?
          </h2>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            No worries — enter your registered email and we'll send you a reset link.
          </p>
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div
          className="flex items-start space-x-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 fade-in-up"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-300 leading-relaxed">{serverError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="fade-in-up fade-in-up-delay-1">
          <label htmlFor="forgot-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <div
            className={`relative auth-input-glow rounded-xl transition-all duration-200 ${
              errors.email ? 'ring-2 ring-red-500/30' : ''
            }`}
          >
            <Mail
              className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              {...register('email', {
                validate: validateEmail,
              })}
              placeholder="name@example.com"
              className="w-full pl-11 pr-10 py-3 bg-slate-800/80 border border-slate-700/80 focus:border-brand-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 transition-all duration-200"
              aria-describedby={errors.email ? 'forgot-email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {emailValue && !errors.email && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-400 text-sm" aria-hidden="true">
                ✓
              </span>
            )}
          </div>
          {errors.email && (
            <p
              id="forgot-email-error"
              className="flex items-center space-x-1 text-xs text-red-400 mt-1.5"
              role="alert"
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !emailValue || !!errors.email}
          className="w-full py-3 bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 active:from-brand-700 active:to-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-brand-500/25 fade-in-up fade-in-up-delay-2"
          aria-label="Send password reset link"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 auth-spinner" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Reset Link</span>
            </>
          )}
        </button>

        {/* Back to login */}
        <div className="text-center pt-1 fade-in-up fade-in-up-delay-3">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>
    </div>
  );
};
