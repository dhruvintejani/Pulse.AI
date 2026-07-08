import { memo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Sparkles, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { usePwaInstallPrompt } from '@/hooks/usePwaInstallPrompt';

const storageKey = 'pulse-ai-install-dismissed';

const InstallPrompt = () => {
  const { canInstall, promptInstall, installed } = usePwaInstallPrompt();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(storageKey) === 'true');
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (installed) setDismissed(true);
  }, [installed]);

  const dismiss = () => {
    localStorage.setItem(storageKey, 'true');
    setDismissed(true);
  };

  const install = async () => {
    setInstalling(true);
    const accepted = await promptInstall();
    setInstalling(false);
    if (accepted) dismiss();
  };

  return (
    <AnimatePresence>
      {canInstall && !dismissed && (
        <motion.aside
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          className="fixed bottom-4 right-4 z-[125] w-[min(24rem,calc(100vw-2rem))] rounded-3xl border border-[rgba(233,162,76,0.22)] bg-[#FFFDF8]/92 p-4 shadow-float backdrop-blur-xl"
          role="region"
          aria-label="Install Pulse AI"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--ds-color-accent-soft)] text-[var(--ds-color-accent)]">
              <Sparkles size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-[var(--ds-color-text)]">Install Pulse AI</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--ds-color-subtle)]">Use it like a native app with offline shell caching, faster launches, and a focused workspace.</p>
            </div>
            <button type="button" aria-label="Dismiss install prompt" onClick={dismiss} className="rounded-lg p-1.5 text-[var(--ds-color-subtle)] hover:bg-[var(--ds-color-accent-soft)] ds-focus-ring">
              <X size={14} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={dismiss}>Later</Button>
            <Button variant="primary" size="sm" loading={installing} icon={<Download size={14} />} onClick={() => void install()}>Install</Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default memo(InstallPrompt);
