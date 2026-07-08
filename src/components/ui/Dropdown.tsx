import { memo, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { cn } from '@/lib/utils';

export interface DropdownItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect: () => void;
}

interface DropdownProps {
  label: string;
  triggerLabel?: ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'end';
  className?: string;
  menuClassName?: string;
}

const Dropdown = ({ label, triggerLabel, items, align = 'end', className, menuClassName }: DropdownProps) => {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const enabledItems = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled);
  const firstEnabledIndex = enabledItems[0]?.index ?? 0;
  const lastEnabledIndex = enabledItems[enabledItems.length - 1]?.index ?? 0;

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEscapeKey(open, close);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [close, open]);

  useEffect(() => {
    if (!open) return;
    itemRefs.current[activeIndex]?.focus({ preventScroll: true });
  }, [activeIndex, open]);

  const moveActive = (direction: 1 | -1) => {
    if (!enabledItems.length) return;
    const enabledIndexes = enabledItems.map(({ index }) => index);
    const currentEnabledPosition = Math.max(0, enabledIndexes.indexOf(activeIndex));
    const nextPosition = (currentEnabledPosition + direction + enabledIndexes.length) % enabledIndexes.length;
    setActiveIndex(enabledIndexes[nextPosition]);
  };

  const openMenu = () => {
    setOpen(true);
    setActiveIndex(firstEnabledIndex);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMenu();
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(lastEnabledIndex);
    }
  };

  const handleItemKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, item: DropdownItem) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(firstEnabledIndex);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(lastEnabledIndex);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!item.disabled) {
        item.onSelect();
        close();
      }
    }
  };

  return (
    <div ref={rootRef} className={cn('relative inline-flex', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        className="ds-control ds-hit-target inline-flex items-center justify-center gap-2 px-3 text-sm font-bold text-[var(--ds-color-text)] ds-focus-ring"
      >
        <span className="min-w-0 truncate">{triggerLabel ?? label}</span>
        <ChevronDown size={15} className={cn('shrink-0 text-[var(--ds-color-subtle)] transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label={label}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={cn('ds-card absolute top-[calc(100%+0.5rem)] z-50 w-64 p-1.5 shadow-[var(--ds-shadow-lg)]', align === 'end' ? 'right-0' : 'left-0', menuClassName)}
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                ref={(node) => { itemRefs.current[index] = node; }}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  item.onSelect();
                  close();
                }}
                onKeyDown={(event) => handleItemKeyDown(event, item)}
                onMouseEnter={() => !item.disabled && setActiveIndex(index)}
                className={cn(
                  'flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ds-focus-ring',
                  item.destructive ? 'text-red-600 hover:bg-red-50' : 'text-[var(--ds-color-muted)] hover:bg-[var(--ds-color-accent-soft)] hover:text-[var(--ds-color-text)]',
                  activeIndex === index && !item.disabled && 'bg-[var(--ds-color-accent-soft)] text-[var(--ds-color-text)]',
                  item.disabled && 'cursor-not-allowed opacity-45'
                )}
              >
                {item.icon && <span className="shrink-0" aria-hidden="true">{item.icon}</span>}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{item.label}</span>
                  {item.description && <span className="mt-0.5 block truncate text-xs text-[var(--ds-color-subtle)]">{item.description}</span>}
                </span>
                {item.shortcut && <kbd className="shrink-0 rounded-md border border-[var(--ds-color-border)] px-1.5 py-0.5 text-[10px] text-[var(--ds-color-subtle)]">{item.shortcut}</kbd>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(Dropdown);
