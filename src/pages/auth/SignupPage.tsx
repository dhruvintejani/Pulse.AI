import { useSignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AuthAlert from '@/components/auth/AuthAlert';
import AuroraBackground from '@/components/backgrounds/AuroraBackground';
import { OAUTH_STRATEGIES } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import { useAuthFormErrors } from '@/hooks/useAuthFormErrors';
import { useOAuthLoading } from '@/hooks/useOAuthLoading';
import { startOAuthRedirect } from '@/services/auth/oauthService';
import type { FieldErrors, OAuthStrategy } from '@/types/auth';
import { getClerkErrorMessage, getClerkFieldErrors } from '@/utils/clerkErrors';
import { hasErrors, validateEmail, validatePassword } from '@/utils/validation';

const perks = [
  'Free 14-day Pro trial',
  'No credit card required',
  'Access all AI models',
  'Cancel anytime',
];

const SignupPage = () => {
  const navigate = useNavigate();
  const { isLoaded, signUp } = useSignUp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { fieldErrors, setFieldErrors, authError, setAuthError, clearFieldError } = useAuthFormErrors();
  const { oauthLoading, setOauthLoading, isOAuthLoading } = useOAuthLoading();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors: FieldErrors = {};
    const emailError = validateEmail(email, 'Work email is required.');
    const passwordError = validatePassword(password);

    if (!firstName.trim()) errors.firstName = 'First name is required.';
    if (!lastName.trim()) errors.lastName = 'Last name is required.';
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    setFieldErrors(errors);
    return !hasErrors(errors);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');

    if (!validate() || !isLoaded || !signUp) return;

    try {
      setIsSubmitting(true);
      await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.trim(),
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      navigate(ROUTES.VERIFY, {
        state: {
          email: email.trim(),
          statusMessage: 'Verification code sent. Check your inbox to finish creating your account.',
        },
      });
    } catch (error) {
      setFieldErrors(getClerkFieldErrors(error));
      setAuthError(getClerkErrorMessage(error, 'Unable to create your account. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (strategy: OAuthStrategy) => {
    if (!isLoaded || !signUp) return;

    try {
      setAuthError('');
      setOauthLoading(strategy);
      await startOAuthRedirect(signUp, strategy);
    } catch (error) {
      setAuthError(getClerkErrorMessage(error, 'Unable to continue with this provider. Please try again.'));
      setOauthLoading(null);
    }
  };

  const busy = isSubmitting || isOAuthLoading;

  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <AuroraBackground />

      {/* Right Panel - Illustration (shown on right for signup) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex flex-col flex-1 relative z-10 p-12 order-last"
      >
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shadow-premium-lg mb-6">
              <Sparkles size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-[#1F1F1F] leading-tight mb-4 tracking-tight">
              Start building
              <br />
              <span className="gradient-text">with AI today</span>
            </h1>
            <p className="text-[#666] leading-relaxed mb-10">
              Join over 12,000 teams using Pulse AI to move faster, think deeper, and create more.
            </p>

            {/* Perks */}
            <div className="space-y-3 mb-10">
              {perks.map((perk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-[rgba(233,162,76,0.15)] flex items-center justify-center shrink-0">
                    <Check size={11} className="text-[#E9A24C]" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-[#444]">{perk}</span>
                </motion.div>
              ))}
            </div>

            {/* Social proof */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                  {['AM', 'SR', 'TC', 'PK'].map((init) => (
                    <div key={init} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#FFFDF8]">
                      {init}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-[#666]">12,450+ teams already joined</span>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-[#E9A24C] text-sm">★</span>
                ))}
                <span className="text-xs text-[#999] ml-1">4.9/5 from 3,200+ reviews</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Left Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center justify-center w-full lg:w-[480px] xl:w-[520px] p-8 lg:p-12"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-[#1F1F1F]">Pulse AI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#1F1F1F] mb-2">Create your account</h2>
            <p className="text-sm text-[#666]">
              Already have an account?{' '}
              <button type="button" onClick={() => navigate(ROUTES.LOGIN)} className="text-[#E9A24C] font-semibold hover:underline">
                Sign in
              </button>
            </p>
          </div>

          {/* Social logins */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: '🌐', label: 'Google', strategy: OAUTH_STRATEGIES.google },
              { icon: '⌘', label: 'GitHub', strategy: OAUTH_STRATEGIES.github },
            ].map((btn) => (
              <motion.button
                key={btn.label}
                type="button"
                disabled={busy}
                onClick={() => handleOAuth(btn.strategy)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(233,162,76,0.3)] transition-all text-sm font-medium text-[#444] shadow-sm"
              >
                {oauthLoading === btn.strategy ? (
                  <span className="w-4 h-4 rounded-full border-2 border-[#E9A24C]/30 border-t-[#E9A24C] animate-spin" />
                ) : (
                  <span>{btn.icon}</span>
                )}
                {btn.label}
              </motion.button>
            ))}
          </div>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[rgba(0,0,0,0.07)]" />
            <span className="text-xs text-[#BBB] font-medium">or sign up with email</span>
            <div className="flex-1 h-px bg-[rgba(0,0,0,0.07)]" />
          </div>

          <div className="mb-4">
            <AuthAlert message={authError} />
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                type="text"
                placeholder="Alex"
                icon={<User size={16} />}
                value={firstName}
                onChange={(event) => {
                  setFirstName(event.target.value);
                  clearFieldError('firstName');
                }}
                error={fieldErrors.firstName}
              />
              <Input
                label="Last name"
                type="text"
                placeholder="Morgan"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                  clearFieldError('lastName');
                }}
                error={fieldErrors.lastName}
              />
            </div>
            <Input
              label="Work email"
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
              label="Password"
              type="password"
              placeholder="Create a strong password"
              icon={<Lock size={16} />}
              showPasswordToggle
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearFieldError('password');
              }}
              error={fieldErrors.password}
            />

            {/* Password strength */}
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[1,2,3,4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= 2 ? 'bg-[#E9A24C]' : 'bg-[rgba(0,0,0,0.08)]'}`} />
                ))}
              </div>
              <p className="text-[11px] text-[#999]">Password strength: <span className="text-[#E9A24C] font-medium">Medium</span></p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              iconRight={<ArrowRight size={16} />}
              loading={isSubmitting}
              disabled={busy || !isLoaded}
            >
              Create free account
            </Button>
          </form>

          <p className="text-[11px] text-[#CCC] text-center mt-6 leading-relaxed">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-[#999] underline">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-[#999] underline">Privacy Policy</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
