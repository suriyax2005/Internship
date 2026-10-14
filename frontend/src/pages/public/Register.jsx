import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../../store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Check,
  X,
  ChevronDown,
} from 'lucide-react';

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
export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: authError } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'LANDLORD',
    },
  });

  const passwordValue = watch('password', '');
  const confirmPasswordValue = watch('confirmPassword', '');
  const emailValue = watch('email', '');
  const fullNameValue = watch('fullName', '');

  /* Strength computation */
  const strength = useMemo(() => getStrength(passwordValue), [passwordValue]);
  const requirementsMet = useMemo(
    () =>
      passwordRequirements.map((r) => ({
        ...r,
        met: r.test(passwordValue),
      })),
    [passwordValue]
  );

  /* Password match status */
  const passwordsMatch = confirmPasswordValue.length > 0 && passwordValue === confirmPasswordValue;
  const passwordsMismatch = confirmPasswordValue.length > 0 && passwordValue !== confirmPasswordValue;

  /* Email validation function matching Section 5 specifications */
  const validateEmail = useCallback((value) => {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return 'Email address is required.';
    }
    const trimmed = value.trim();

    // Check for internal whitespace
    if (/\s/.test(trimmed)) {
      return 'Please enter a valid email address.';
    }

    // Must have exactly one @ separating local and domain
    const atParts = trimmed.split('@');
    if (atParts.length !== 2) {
      return 'Please enter a valid email address.';
    }

    const [local, domain] = atParts;
    if (!local || !domain) {
      return 'Please enter a valid email address.';
    }

    // Local part constraints: cannot start/end with dot, no consecutive dots
    if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
      return 'Please enter a valid email address.';
    }

    // Domain constraints: must contain dot, cannot start/end with dot or hyphen, no consecutive dots
    if (
      !domain.includes('.') ||
      domain.startsWith('.') ||
      domain.endsWith('.') ||
      domain.startsWith('-') ||
      domain.endsWith('-') ||
      domain.includes('..')
    ) {
      return 'Please enter a valid email address.';
    }

    // Domain parts validation
    const domainLabels = domain.split('.');
    for (const label of domainLabels) {
      if (!label || label.startsWith('-') || label.endsWith('-')) {
        return 'Please enter a valid email address.';
      }
    }

    // TLD must be at least 2 alpha characters
    const tld = domainLabels[domainLabels.length - 1];
    if (!/^[a-zA-Z]{2,}$/.test(tld)) {
      return 'Please enter a valid email address.';
    }

    // Standard RFC compliant email regex check
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address.';
    }

    return true;
  }, []);

  /* Password validation */
  const validatePassword = useCallback((value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (value.length > 128) return 'Password must be at most 128 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter';
    if (!/\d/.test(value)) return 'Password must contain a number';
    if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain a special character';
    return true;
  }, []);

  const onSubmit = async (data) => {
    if (isSubmitting || loading) return;

    // Strict frontend validation check before calling registration API
    const trimmedEmail = (data.email || '').trim();
    const emailCheck = validateEmail(trimmedEmail);
    if (emailCheck !== true) {
      setError('email', { type: 'manual', message: emailCheck });
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...submitData } = data;
      // Trim email and full name before sending payload
      submitData.email = trimmedEmail;
      submitData.fullName = submitData.fullName?.trim();

      const res = await dispatch(registerUser(submitData));
      if (registerUser.fulfilled.match(res)) {
        if (data.role === 'TENANT') {
          navigate('/tenant/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailValid = emailValue && emailValue.trim() && !errors.email && validateEmail(emailValue) === true;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-2 fade-in-up">
        <h2 className="text-2xl sm:text-[26px] font-black text-white tracking-tight">
          Create your account
        </h2>
        <p className="text-sm text-slate-400">
          Start managing properties smarter today
        </p>
      </div>

      {/* Auth error banner */}
      {authError && (
        <div
          className="flex items-start space-x-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 fade-in-up"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-300 leading-relaxed">{authError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <div className="fade-in-up fade-in-up-delay-1">
          <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Full Name
          </label>
          <div
            className={`relative auth-input-glow rounded-xl transition-all duration-200 ${
              errors.fullName ? 'ring-2 ring-red-500/30' : ''
            }`}
          >
            <User
              className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="reg-fullname"
              type="text"
              required
              autoComplete="name"
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
              })}
              placeholder="John Doe"
              className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/80 focus:border-brand-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 transition-all duration-200"
              aria-describedby={errors.fullName ? 'reg-fullname-error' : undefined}
              aria-invalid={!!errors.fullName}
            />
            {fullNameValue && !errors.fullName && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-400 text-sm" aria-hidden="true">
                ✓
              </span>
            )}
          </div>
          {errors.fullName && (
            <p
              id="reg-fullname-error"
              className="flex items-center space-x-1 text-xs text-red-400 mt-1.5"
              role="alert"
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.fullName.message}</span>
            </p>
          )}
        </div>

        {/* Email Address - Mandatory Email Validation Module */}
        <div className="fade-in-up fade-in-up-delay-2">
          <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
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
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              {...register('email', {
                required: 'Email address is required.',
                validate: validateEmail,
              })}
              placeholder="name@example.com"
              className={`w-full pl-11 pr-10 py-3 bg-slate-800/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 transition-all duration-200 ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : isEmailValid
                  ? 'border-emerald-500/70 focus:border-emerald-500'
                  : 'border-slate-700/80 focus:border-brand-500'
              }`}
              aria-describedby={errors.email ? 'reg-email-error' : isEmailValid ? 'reg-email-valid' : undefined}
              aria-invalid={!!errors.email}
              aria-required="true"
            />
            {isEmailValid && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 text-sm font-bold pointer-events-none" aria-hidden="true">
                ✓
              </span>
            )}
          </div>
          {/* Inline Email Error Message */}
          {errors.email && (
            <p
              id="reg-email-error"
              className="flex items-center space-x-1.5 text-xs text-red-400 mt-1.5 font-medium"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
              <span>{errors.email.message}</span>
            </p>
          )}
          {/* Inline Email Success Message */}
          {isEmailValid && (
            <p id="reg-email-valid" className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-1.5 font-medium" role="status">
              <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>Valid email address</span>
            </p>
          )}
        </div>

        {/* Role Selector */}
        <div className="fade-in-up fade-in-up-delay-3">
          <label htmlFor="reg-role" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Account Type
          </label>
          <div className="relative">
            <select
              id="reg-role"
              {...register('role')}
              className="w-full appearance-none px-4 py-3 bg-slate-800/80 border border-slate-700/80 focus:border-brand-500 rounded-xl text-sm text-white focus:outline-none focus:ring-0 transition-all duration-200 cursor-pointer"
              aria-label="Select account type"
            >
              <option value="LANDLORD">Landlord / Property Manager</option>
              <option value="TENANT">Tenant</option>
            </select>
            <ChevronDown
              className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Password */}
        <div className="fade-in-up fade-in-up-delay-3">
          <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Password
          </label>
          <div
            className={`relative auth-input-glow rounded-xl transition-all duration-200 ${
              errors.password ? 'ring-2 ring-red-500/30' : ''
            }`}
          >
            <Lock
              className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              {...register('password', {
                validate: validatePassword,
              })}
              placeholder="Create a strong password"
              className="w-full pl-11 pr-12 py-3 bg-slate-800/80 border border-slate-700/80 focus:border-brand-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 transition-all duration-200"
              aria-describedby="password-strength password-requirements"
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="w-[18px] h-[18px]" />
              ) : (
                <Eye className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>

          {/* Password Strength Meter */}
          {passwordValue && (
            <div className="mt-2.5 space-y-2.5" id="password-strength">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Password strength</span>
                <span className={`text-[11px] font-semibold ${strengthTextColor[strength.score] || 'text-slate-500'}`}>
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${strength.className}`}
                />
              </div>

              {/* Requirements checklist */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1" id="password-requirements" role="list" aria-label="Password requirements">
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
        <div className="fade-in-up fade-in-up-delay-4">
          <label htmlFor="reg-confirm-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Confirm Password
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
              id="reg-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === passwordValue || 'Passwords do not match',
              })}
              placeholder="Re-enter your password"
              className="w-full pl-11 pr-12 py-3 bg-slate-800/80 border border-slate-700/80 focus:border-brand-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 transition-all duration-200"
              aria-describedby="password-match-status"
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

          {/* Match indicator */}
          <div id="password-match-status" className="mt-1.5">
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

        {/* Terms */}
        <p className="text-[11px] text-slate-500 leading-relaxed fade-in-up fade-in-up-delay-5">
          By creating an account, you agree to our{' '}
          <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">Terms of Service</span>{' '}
          and{' '}
          <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="w-full py-3 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-600/25 hover:shadow-brand-500/40 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-brand-600/25 fade-in-up fade-in-up-delay-5"
          aria-label="Create your account"
        >
          {loading || isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 auth-spinner" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative fade-in-up fade-in-up-delay-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-slate-900/70 text-slate-500">or</span>
        </div>
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-slate-400 fade-in-up fade-in-up-delay-6">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};
