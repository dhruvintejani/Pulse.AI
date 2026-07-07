import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AuroraBackground from '@/components/backgrounds/AuroraBackground';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

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
              <Mail size={24} className="text-[#E9A24C]" />
            </div>
            <h2 className="text-2xl font-black text-[#1F1F1F] mb-2">Forgot password?</h2>
            <p className="text-sm text-[#666] leading-relaxed">
              No worries. Enter your email address and we'll send you a secure reset link.
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/reset-password'); }}>
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              icon={<Mail size={16} />}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              iconRight={<ArrowRight size={16} />}
            >
              Send reset link
            </Button>
          </form>

          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-sm text-[#999] hover:text-[#666] transition-colors mt-6 mx-auto"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
