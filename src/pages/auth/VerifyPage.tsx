import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import AuroraBackground from '@/components/backgrounds/AuroraBackground';
import { useState, useRef } from 'react';

const VerifyPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const allFilled = code.every(d => d !== '');

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
            <span className="font-semibold text-[#1F1F1F]">you@company.com</span>
          </p>

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
            disabled={!allFilled}
            onClick={() => navigate('/dashboard')}
            iconRight={<ArrowRight size={16} />}
          >
            Verify and continue
          </Button>

          <button className="flex items-center justify-center gap-2 text-sm text-[#999] hover:text-[#E9A24C] transition-colors w-full mt-2">
            <RefreshCw size={14} />
            Resend code in 0:45
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyPage;
