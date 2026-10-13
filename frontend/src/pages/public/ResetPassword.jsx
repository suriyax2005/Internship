import React, { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import {
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

/* ──────────────────────────────────
   Password strength helpers
   ────────────────────────────────── */
const passwordRequirements = [
  { key: 'minLength', label: 'Minimum 8 characters', test: (v) => v.length >= 8 },
  { key: 'maxLength', label: 'Maximum 128 characters', test: (v) => v.length <= 128 },
  { key: 'uppercase', label: 'Uppercase letter (A-Z)', test: (v) => /[A-Z]/.test(v) },
  { key: 'lowercase', label: 'Lowercase letter (a-z)', test: (v) => /[a-z]/.test(v) },
  { key: 'number', label: 'Number (0-9)', test: (v) => /\d/.test(v) },
  { key: 'special', label: 'Special character (!@#$...)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function getStrength(password) {
  if (!password) return { score: 0, label: '', className: '' };
  const passed = passwordRequirements.filter((r) => r.test(password)).length;
  if (passed <= 2) return { score: 1, label: 'Weak', className: 'strength-weak' };
  if (passed <= 3) return { score: 2, label: 'Fair', className: 'strength-fair' };
  if (passed <= 4) return { score: 3, label: 'Good', className: 'strength-good' };
  if (passed <= 5) return { score: 4, label: 'Strong', className: 'strength-strong' };
  return { score: 5, label: 'Excellent', className: 'strength-excellent' };
}

const strengthTextColor = {
  1: 'text-red-400',
  2: 'text-orange-400',
  3: 'text-yellow-400',
  4: 'text-emerald-400',
  5: 'text-emerald-300',
};

/* ──────────────────────────────────
   Component
   ────────────────────────────────── */
export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const passwordValue = watch('newPassword', '');
  const confirmPasswordValue = watch('confirmPassword', '');

  /* Strength & requirements */
  const strength = useMemo(() => getStrength(passwordValue), [passwordValue]);
  const requirementsMet = useMemo(
    () => passwordRequirements.map((r) => ({ ...r, met: r.test(passwordValue) })),
    [passwordValue]
  );

  /* Match status */
  const passwordsMatch = confirmPasswordValue.length > 0 && passwordValue === confirmPasswordValue;
  const passwordsMismatch = confirmPasswordValue.length > 0 && passwordValue !== confirmPasswordValue;

  /* Validate password */
  const validatePassword = useCallback((value) => {
    if (!value) return 'New password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (value.length > 128) return 'Password must be at most 128 characters';
    if (!/[A-Z]/.test(value)) return 'Must contain an uppercase letter';
    if (!/[a-z]/.test(value)) return 'Must contain a lowercase letter';
    if (!/\d/.test(value)) return 'Must contain a number';
    if (!/[^A-Za-z0-9]/.test(value)) return 'Must contain a special character';
    return true;
  }, []);

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    setServerError('');
    try {
      await api.post(`/auth/reset-password/${token}`, { newPassword: data.newPassword });
      setSuccess(true);
      toast.success('Password reset successfully!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid or expired reset link. Please request a new one.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Success State ── */
  if (success) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          {/* Animated success icon */}
          <div className="relative">
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-emerald-500/20 animate-pulse-ring" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-brand-500 to-emerald-400 rounded-full flex items-center justify-center animate-scale-in shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Password Updated</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </div>

          <Link
            to="/login"
            className="w-full py-3 bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Sign In Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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
            Set new password
          </h2>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Choose a strong password to secure your account.
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
        {/* New Password */}
        <div className="fade-in-up fade-in-up-delay-1">
          <label htmlFor="reset-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
            New Password
          </label>
          <div
            className={`relative auth-input-glow rounded-xl transition-all duration-200 ${
              errors.newPassword ? 'ring-2 ring-red-500/30' : ''
            }`}
          >
            <Lock
              className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="reset-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('newPassword', {
                validate: validatePassword,
              })}
              placeholder="Create a strong password"
              className="w-full pl-11 pr-12 py-3 bg-slate-800/80 border border-slate-700/80 focus:border-brand-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 transition-all duration-200"
              aria-describedby="reset-password-strength reset-password-reqs"
              aria-invalid={!!errors.newPassword}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </div>

          {/* Strength meter */}
          {passwordValue && (
            <div className="mt-2.5 space-y-2.5" id="reset-password-strength">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Password strength</span>
                <span
                  className={`text-[11px] font-semibold ${strengthTextColor[strength.score] || 'text-slate-500'}`}
                >
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${strength.className}`}
                />
              </div>

              {/* Checklist */}
              <div
                className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1"
                id="reset-password-reqs"
                role="list"
                aria-label="Password requirements"
              >
                {requirementsMet.map((req) => (
                  <div key={req.key} className="flex items-center space-x-1.5" role="listitem">
                    {req.met ? (
                      <Check className="w-3 h-3 text-brand-400 shrink-0" />
                    ) : (
                      <X className="w-3 h-3 text-slate-600 shrink-0" />
                    )}
                    <span
                      className={`text-[11px] transition-colors duration-200 ${
                        req.met ? 'text-brand-400' : 'text-slate-500'
                      }`}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="fade-in-up fade-in-up-delay-2">
          <label htmlFor="reset-confirm-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Confirm New Password
          </label>
          <div
            className={`relative auth-input-glow rounded-xl transition-all duration-200 ${
              errors.confirmPassword || passwordsMismatch ? 'ring-2 ring-red-500/30' : ''
            } ${passwordsMatch ? 'ring-2 ring-brand-500/30' : ''}`}
          >
            <Lock
              className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="reset-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Please confirm your new password',
                validate: (value) => value === passwordValue || 'Passwords do not match',
              })}
              placeholder="Re-enter new password"
              className="w-full pl-11 pr-12 py-3 bg-slate-800/80 border border-slate-700/80 focus:border-brand-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 transition-all duration-200"
              aria-describedby="reset-match-status"
              aria-invalid={!!errors.confirmPassword || passwordsMismatch}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-[18px] h-[18px]" />
              ) : (
                <Eye className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>

          {/* Match status */}
          <div id="reset-match-status" className="mt-1.5">
            {passwordsMatch && (
              <p className="flex items-center space-x-1 text-xs text-brand-400" role="status">
                <Check className="w-3 h-3" />
                <span>Passwords match</span>
              </p>
            )}
            {passwordsMismatch && !errors.confirmPassword && (
              <p className="flex items-center space-x-1 text-xs text-red-400" role="alert">
                <X className="w-3 h-3" />
                <span>Passwords do not match</span>
              </p>
            )}
            {errors.confirmPassword && (
              <p className="flex items-center space-x-1 text-xs text-red-400" role="alert">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.confirmPassword.message}</span>
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 active:from-brand-700 active:to-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-brand-500/25 fade-in-up fade-in-up-delay-3"
          aria-label="Reset your password"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 auth-spinner" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Reset Password</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
