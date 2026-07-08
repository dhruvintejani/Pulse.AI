import { useSignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import AuthAlert from '@/components/auth/AuthAlert';
import AuroraBackground from '@/components/backgrounds/AuroraBackground';
import { ROUTES } from '@/constants/routes';
import type { AuthEmailState } from '@/types/auth';
import { getClerkErrorMessage } from '@/utils/clerkErrors';

const EMPTY_CODE = ['', '', '', '', '', ''];

const VerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoaded, signUp, setActive } = useSignUp();
  const routeState = location.state as AuthEmailState | null;
  const [code, setCode] = useState(EMPTY_CODE);
  const [authError, setAuthError] = useState('');
  const [statusMessage, setStatusMessage] = useState(routeState?.statusMessage ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const verificationEmail = routeState?.email || signUp?.emailAddress || 'your email address';
  const allFilled = code.every(d => d !== '');

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setAuthError('');
    setStatusMessage('');
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!allFilled || !isLoaded || !signUp) return;

    try {
      setAuthError('');
      setStatusMessage('');
      setIsSubmitting(true);
      const result = await signUp.attemptEmailAddressVerification({ code: code.join('') });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate(ROUTES.DASHBOARD, { replace: true });
        return;
      }

      setAuthError('Please complete email verification to continue.');
    } catch (error) {
      setAuthError(getClerkErrorMessage(error, 'Invalid verification code. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !signUp) return;

    try {
      setAuthError('');
      setStatusMessage('');
      setIsResending(true);
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setCode(EMPTY_CODE);
      setStatusMessage('A new verification code has been sent to your email.');
      inputsRef.current[0]?.focus();
    } catch (error) {
      setAuthError(getClerkErrorMessage(error, 'Unable to resend the code. Please try again.'));
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
        className="relative z-10 w-full max-w-md text-center"
      >
        <div className="glass-card rounded-3xl p-8 shadow-float">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-[#1F1F1F]">Pulse AI</span>
          </div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-2xl bg-[rgba(233,162,76,0.1)] flex items-center justify-center mx-auto mb-6"
          >
            <Mail size={28} className="text-[#E9A24C]" />
          </motion.div>

          <h2 className="text-2xl font-black text-[#1F1F1F] mb-2">Check your email</h2>
          <p className="text-sm text-[#666] leading-relaxed mb-8">
            We sent a 6-digit verification code to
            <br />
            <span className="font-semibold text-[#1F1F1F]">{verificationEmail}</span>
          </p>

          <div className="mb-6 text-left space-y-3">
            <AuthAlert message={statusMessage} variant="success" />
            <AuthAlert message={authError} />
          </div>

          {/* OTP Input */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputsRef.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`Verification code digit ${i + 1}`}
                className={`w-12 h-14 text-center text-lg font-bold rounded-xl border-2 outline-none transition-all duration-200 bg-white
                  ${digit
                    ? 'border-[#E9A24C] shadow-[0_0_0_3px_rgba(233,162,76,0.12)] text-[#E9A24C]'
                    : 'border-[rgba(0,0,0,0.1)] text-[#1F1F1F] focus:border-[#E9A24C] focus:shadow-[0_0_0_3px_rgba(233,162,76,0.12)]'
                  }`}
              />
            ))}
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full mb-4"
            disabled={!allFilled || isSubmitting || isResending || !isLoaded}
            onClick={handleVerify}
            iconRight={<ArrowRight size={16} />}
            loading={isSubmitting}
          >
            Verify and continue
          </Button>

          <button
            type="button"
            disabled={isResending}
            onClick={handleResend}
            className="flex items-center justify-center gap-2 text-sm text-[#999] hover:text-[#E9A24C] transition-colors w-full mt-2 disabled:opacity-60"
          >
            <RefreshCw size={14} className={isResending ? 'animate-spin' : ''} />
            {isResending ? 'Resending code...' : 'Resend code'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyPage;
