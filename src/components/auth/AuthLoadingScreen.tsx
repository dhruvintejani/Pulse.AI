import { Sparkles } from 'lucide-react';

const AuthLoadingScreen = () => (
  <div className="min-h-dvh flex items-center justify-center bg-[#F8F4EC] px-4" role="status" aria-live="polite" aria-label="Loading authentication">
    <div className="glass-card flex w-full max-w-sm flex-col items-center rounded-3xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-8 text-center shadow-float">
      <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] shadow-premium">
        <Sparkles size={22} className="text-white" aria-hidden="true" />
        <span className="absolute inset-0 rounded-2xl animate-ping bg-[#E9A24C]/25" aria-hidden="true" />
      </div>
      <p className="text-sm font-black text-[#1F1F1F]">Securing your session</p>
      <p className="mt-1 text-xs text-[#999]">Loading Pulse AI...</p>
      <span className="sr-only">Loading Pulse AI</span>
    </div>
  </div>
);

export default AuthLoadingScreen;
