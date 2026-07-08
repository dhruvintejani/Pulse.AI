import { memo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';

const OfflineBanner = () => {
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed left-1/2 top-3 z-[140] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[rgba(245,158,11,0.28)] bg-[rgba(255,253,248,0.95)] px-4 py-2 text-xs font-bold text-[#92400E] shadow-float backdrop-blur-xl"
          role="status"
          aria-live="polite"
        >
          <WifiOff size={14} aria-hidden="true" /> Offline mode · cached pages are still available
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(OfflineBanner);
