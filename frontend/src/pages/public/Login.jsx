import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../../store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: authError } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const emailValue = watch('email', '');
  const passwordValue = watch('password', '');

  // Real-time email validation
  const validateEmail = useCallback((value) => {
    if (!value || !value.trim()) return 'Email address is required';
    const trimmed = value.trim();
    if (/\s/.test(trimmed)) return 'Email cannot contain spaces';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) return 'Please enter a valid email address';
    if (/@@/.test(trimmed)) return 'Please enter a valid email address';
    return true;
  }, []);

  const onSubmit = async (data) => {
    if (isSubmitting || loading) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        email: data.email?.trim(),
      };
      const res = await dispatch(loginUser(payload));
      if (loginUser.fulfilled.match(res)) {
        const role = res.payload.user.role;
        if (role === 'TENANT') {
          navigate('/tenant/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormReady = emailValue && passwordValue && !errors.email && !errors.password;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 fade-in-up">
        <h2 className="text-2xl sm:text-[26px] font-black text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-slate-400">
          Sign in to your account to continue
        </p>
      </div>

      {/* Auth error banner */}
      {authError && (
        <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 fade-in-up" role="alert">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-300 leading-relaxed">{authError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <div className="fade-in-up fade-in-up-delay-1">
          <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className={`relative auth-input-glow rounded-xl transition-all duration-200 ${errors.email ? 'ring-2 ring-red-500/30' : ''}`}>
            <Mail className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" aria-hidden="true" />
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              {...register('email', {
                validate: validateEmail,
              })}
              placeholder="name@example.com"
              className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/80 focus:border-brand-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 transition-all duration-200"
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {/* Valid checkmark */}
            {emailValue && !errors.email && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-400 text-sm" aria-hidden="true">✓</span>
            )}
          </div>
          {errors.email && (
            <p id="login-email-error" className="flex items-center space-x-1 text-xs text-red-400 mt-1.5" role="alert">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div className="fade-in-up fade-in-up-delay-2">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="text-xs font-semibold text-slate-300">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
              tabIndex={0}
            >
              Forgot password?
            </Link>
          </div>
          <div className={`relative auth-input-glow rounded-xl transition-all duration-200 ${errors.password ? 'ring-2 ring-red-500/30' : ''}`}>
            <Lock className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" aria-hidden="true" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
              placeholder="Enter your password"
              className="w-full pl-11 pr-12 py-3 bg-slate-800/80 border border-slate-700/80 focus:border-brand-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 transition-all duration-200"
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              aria-invalid={!!errors.password}
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
          {errors.password && (
            <p id="login-password-error" className="flex items-center space-x-1 text-xs text-red-400 mt-1.5" role="alert">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center fade-in-up fade-in-up-delay-3">
          <label className="flex items-center cursor-pointer group" htmlFor="remember-me">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={() => setRememberMe((prev) => !prev)}
              className="sr-only"
              aria-label="Remember me on this device"
            />
            <span
              className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-200 mr-2 ${
                rememberMe
                  ? 'bg-brand-500 border-brand-500'
                  : 'bg-slate-800 border-slate-600 group-hover:border-slate-500'
              }`}
              aria-hidden="true"
            >
              {rememberMe && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors select-none">
              Remember me
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || isSubmitting || !isFormReady}
          className="w-full py-3 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-600/25 hover:shadow-brand-500/40 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-brand-600/25 fade-in-up fade-in-up-delay-4"
          aria-label="Sign in to your account"
        >
          {(loading || isSubmitting) ? (
            <>
              <Loader2 className="w-4 h-4 auth-spinner" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative fade-in-up fade-in-up-delay-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-slate-900/70 text-slate-500">or</span>
        </div>
      </div>

      {/* Register Link */}
      <p className="text-center text-sm text-slate-400 fade-in-up fade-in-up-delay-6">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
          Create account
        </Link>
      </p>
    </div>
  );
};
