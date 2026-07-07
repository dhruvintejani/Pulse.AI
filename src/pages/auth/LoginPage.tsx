import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AuroraBackground from '@/components/backgrounds/AuroraBackground';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <AuroraBackground />

      {/* Left Panel - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex flex-col flex-1 relative z-10 p-12"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shadow-premium">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold text-[#1F1F1F]">Pulse AI</span>
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col justify-center max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl font-black text-[#1F1F1F] leading-tight mb-4 tracking-tight">
              Welcome back to
              <br />
              <span className="gradient-text">your workspace</span>
            </h1>
            <p className="text-[#666] leading-relaxed mb-10">
              Sign in to continue your conversations, access your documents, and pick up right where you left off.
            </p>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                { icon: '⚡', title: 'Lightning fast responses', desc: 'Get answers in under 50ms' },
                { icon: '🔒', title: 'Enterprise-grade security', desc: 'Your data stays private' },
                { icon: '🌐', title: 'Multi-model AI access', desc: 'GPT-4, Claude, Gemini & more' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60"
                >
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#1F1F1F]">{f.title}</p>
                    <p className="text-xs text-[#999]">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom quote */}
        <div className="glass rounded-2xl p-5 max-w-sm">
          <p className="text-sm text-[#444] italic leading-relaxed mb-3">
            "Pulse AI cut our research time by 70%. It's the tool we didn't know we needed."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center text-white text-[10px] font-bold">TC</div>
            <div>
              <p className="text-xs font-semibold text-[#1F1F1F]">Tom Chen</p>
              <p className="text-[10px] text-[#999]">Head of Research, Vertex AI</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center justify-center w-full lg:w-[480px] xl:w-[520px] p-8 lg:p-12"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-[#1F1F1F]">Pulse AI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#1F1F1F] mb-2">Sign in</h2>
            <p className="text-sm text-[#666]">
              Don't have an account?{' '}
              <button onClick={() => navigate('/signup')} className="text-[#E9A24C] font-semibold hover:underline">
                Sign up free
              </button>
            </p>
          </div>

          {/* Social logins */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(233,162,76,0.3)] transition-all text-sm font-medium text-[#444] shadow-sm"
            >
              <span className="w-4 h-4 text-blue-500 font-bold text-xs">G</span>
              Google
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(233,162,76,0.3)] transition-all text-sm font-medium text-[#444] shadow-sm"
            >
              <span className="w-4 h-4 text-[#1F1F1F] font-bold text-xs">⌘</span>
              GitHub
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[rgba(0,0,0,0.07)]" />
            <span className="text-xs text-[#BBB] font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-[rgba(0,0,0,0.07)]" />
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              icon={<Mail size={16} />}
              defaultValue="demo@pulseai.com"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={<Lock size={16} />}
              showPasswordToggle
              defaultValue="password123"
            />

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-xs text-[#E9A24C] font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              iconRight={<ArrowRight size={16} />}
            >
              Sign in to workspace
            </Button>
          </form>

          {/* Terms */}
          <p className="text-[11px] text-[#CCC] text-center mt-6 leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="#" className="text-[#999] underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#999] underline">Privacy Policy</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
