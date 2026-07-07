import { useSignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Mail, KeyRound, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AuthAlert from '@/components/auth/AuthAlert';
import AuroraBackground from '@/components/backgrounds/AuroraBackground';
import { ROUTES } from '@/constants/routes';
import { useAuthFormErrors } from '@/hooks/useAuthFormErrors';
import type { AuthEmailState, FieldErrors } from '@/types/auth';
import { getClerkErrorMessage, getClerkFieldErrors } from '@/utils/clerkErrors';
import { hasErrors, validateEmail, validatePassword } from '@/utils/validation';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoaded, signIn, setActive } = useSignIn();
  const stateEmail = (location.state as AuthEmailState | null)?.email ?? '';
  const [email, setEmail] = useState(stateEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { fieldErrors, setFieldErrors, authError, setAuthError, clearFieldError } = useAuthFormErrors();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const validate = () => {
    const errors: FieldErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, 'New password is required.');

    if (emailError) errors.email = emailError;
    if (!code.trim()) errors.code = 'Reset code is required.';
    if (passwordError) errors.password = passwordError;
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return !hasErrors(errors);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');

    if (!validate() || !isLoaded || !signIn) return;

    try {
      setIsSubmitting(true);
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate(ROUTES.DASHBOARD, { replace: true });
        return;
      }

      setAuthError('Please complete the required password reset step to continue.');
    } catch (error) {
      setFieldErrors(getClerkFieldErrors(error));
      setAuthError(getClerkErrorMessage(error, 'Unable to reset your password. Please check the code and try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setAuthError('');

    if (!email.trim()) {
      setFieldErrors({ email: 'Enter your email address before requesting a new code.' });
      return;
    }

    if (!isLoaded || !signIn) return;

    try {
      setIsResending(true);
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
    } catch (error) {
      setFieldErrors(getClerkFieldErrors(error));
      setAuthError(getClerkErrorMessage(error, 'Unable to resend the reset code. Please try again.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-6">
      <AuroraBackground />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 shadow-float">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-[#1F1F1F]">Pulse AI</span>
          </div>

          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(233,162,76,0.1)] flex items-center justify-center mb-5">
              <Lock size={24} className="text-[#E9A24C]" />
            </div>
            <h2 className="text-2xl font-black text-[#1F1F1F] mb-2">Reset password</h2>
            <p className="text-sm text-[#666] leading-relaxed">
              Enter the reset code from your email and choose a new password.
            </p>
          </div>

          <div className="mb-4">
            <AuthAlert message={authError} />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              icon={<Mail size={16} />}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFieldError('email');
              }}
              error={fieldErrors.email}
            />
            <Input
              label="Reset code"
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit code"
              icon={<KeyRound size={16} />}
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                clearFieldError('code');
              }}
              error={fieldErrors.code}
            />
            <Input
              label="New password"
              type="password"
              placeholder="Create a new password"
              icon={<Lock size={16} />}
              showPasswordToggle
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearFieldError('password');
              }}
              error={fieldErrors.password}
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="Confirm your new password"
              icon={<Lock size={16} />}
              showPasswordToggle
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                clearFieldError('confirmPassword');
              }}
              error={fieldErrors.confirmPassword}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              iconRight={<ArrowRight size={16} />}
              loading={isSubmitting}
            >
              Reset Password
            </Button>
          </form>

          <button
            type="button"
            disabled={isResending}
            onClick={handleResendCode}
            className="flex items-center justify-center gap-2 text-sm text-[#999] hover:text-[#E9A24C] transition-colors mt-5 mx-auto"
          >
            <RefreshCw size={14} className={isResending ? 'animate-spin' : ''} />
            {isResending ? 'Sending code...' : 'Resend reset code'}
          </button>

          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="flex items-center gap-2 text-sm text-[#999] hover:text-[#666] transition-colors mt-4 mx-auto"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
