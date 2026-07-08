import { memo } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface OAuthButtonProps {
  label: string;
  icon: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const OAuthButton = ({ label, icon, loading = false, disabled = false, onClick }: OAuthButtonProps) => (
  <motion.button
    type="button"
    disabled={disabled || loading}
    onClick={onClick}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.97 }}
    className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(233,162,76,0.3)] transition-all text-sm font-medium text-[#444] shadow-sm disabled:opacity-60"
  >
    {loading ? (
      <span className="w-4 h-4 rounded-full border-2 border-[#E9A24C]/30 border-t-[#E9A24C] animate-spin" aria-hidden="true" />
    ) : (
      icon
    )}
    {label}
  </motion.button>
);

export default memo(OAuthButton);
