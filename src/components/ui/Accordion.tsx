import { memo, useId, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultValue?: string[];
  className?: string;
}

const Accordion = ({ items, allowMultiple = false, defaultValue = [], className }: AccordionProps) => {
  const baseId = useId();
  const [openItems, setOpenItems] = useState<string[]>(defaultValue);

  const toggleItem = (itemId: string) => {
    setOpenItems((current) => {
      const open = current.includes(itemId);
      if (allowMultiple) return open ? current.filter((id) => id !== itemId) : [...current, itemId];
      return open ? [] : [itemId];
    });
  };

  return (
    <div className={cn('divide-y divide-[var(--ds-color-border)] overflow-hidden rounded-2xl border border-[var(--ds-color-border)] bg-[var(--ds-color-surface)]', className)}>
      {items.map((item) => {
        const open = openItems.includes(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id}>
            <h3>
              <button
                id={triggerId}
                type="button"
                disabled={item.disabled}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="flex min-h-12 w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-bold text-[var(--ds-color-text)] transition-colors hover:bg-[var(--ds-color-accent-soft)] disabled:cursor-not-allowed disabled:opacity-50 ds-focus-ring"
              >
                <span className="min-w-0">{item.title}</span>
                <ChevronDown size={16} className={cn('shrink-0 text-[var(--ds-color-subtle)] transition-transform', open && 'rotate-180')} aria-hidden="true" />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 text-sm leading-relaxed text-[var(--ds-color-muted)]">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default memo(Accordion);
