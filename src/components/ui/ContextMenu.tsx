import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { cn } from '@/lib/utils';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect: () => void;
}

interface ContextMenuProps {
  children: ReactNode;
  items: ContextMenuItem[];
  label?: string;
  className?: string;
}

const clampPosition = (x: number, y: number) => ({
  x: Math.min(x, Math.max(16, window.innerWidth - 288)),
  y: Math.min(y, Math.max(16, window.innerHeight - 260)),
});

const ContextMenu = ({ children, items, label = 'Context menu', className }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);

  const enabledItems = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled);
  const firstEnabled = enabledItems[0]?.index ?? 0;
  const lastEnabled = enabledItems[enabledItems.length - 1]?.index ?? 0;

  const close = useCallback(() => setOpen(false), []);
  useEscapeKey(open, close);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) close();
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [close, open]);

  useEffect(() => {
    if (!open) return;
    itemRefs.current[activeIndex]?.focus({ preventScroll: true });
  }, [activeIndex, open]);

  const openAt = (x: number, y: number) => {
    setPosition(clampPosition(x, y));
    setActiveIndex(firstEnabled);
    setOpen(true);
  };

  const moveActive = (direction: 1 | -1) => {
    const indexes = enabledItems.map(({ index }) => index);
    if (!indexes.length) return;
    const currentPosition = Math.max(0, indexes.indexOf(activeIndex));
    setActiveIndex(indexes[(currentPosition + direction + indexes.length) % indexes.length]);
  };

  const handleItemKeyDown = (event: KeyboardEvent<HTMLButtonElement>, item: ContextMenuItem) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(firstEnabled);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(lastEnabled);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!item.disabled) {
        item.onSelect();
        close();
      }
    }
  };

  const handleContainerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return;
    event.preventDefault();
    const target = event.currentTarget.getBoundingClientRect();
    openAt(target.left + Math.min(target.width / 2, 240), target.top + Math.min(target.height / 2, 160));
  };

  return (
    <div
      className={className}
      onKeyDown={handleContainerKeyDown}
      onContextMenu={(event) => {
        event.preventDefault();
        openAt(event.clientX, event.clientY);
      }}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label={label}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="ds-card fixed z-[140] w-64 p-1.5 shadow-[var(--ds-shadow-lg)]"
            style={{ left: position.x, top: position.y }}
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
                <span className="min-w-0 flex-1 truncate font-semibold">{item.label}</span>
                {item.shortcut && <kbd className="shrink-0 rounded-md border border-[var(--ds-color-border)] px-1.5 py-0.5 text-[10px] text-[var(--ds-color-subtle)]">{item.shortcut}</kbd>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(ContextMenu);
