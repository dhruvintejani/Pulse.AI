import { memo, useId, useMemo, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  tabListClassName?: string;
  panelClassName?: string;
}

const Tabs = ({ items, label, value, defaultValue, onValueChange, className, tabListClassName, panelClassName }: TabsProps) => {
  const baseId = useId();
  const firstEnabled = useMemo(() => items.find((item) => !item.disabled)?.id ?? items[0]?.id ?? '', [items]);
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);
  const selectedValue = value ?? internalValue;
  const selectedItem = items.find((item) => item.id === selectedValue) ?? items.find((item) => !item.disabled) ?? items[0];

  const selectValue = (nextValue: string) => {
    if (items.find((item) => item.id === nextValue)?.disabled) return;
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((item) => !item.disabled);
    const currentIndex = enabled.findIndex((item) => item.id === selectedValue);
    if (!enabled.length) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      selectValue(enabled[(currentIndex + 1 + enabled.length) % enabled.length].id);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      selectValue(enabled[(currentIndex - 1 + enabled.length) % enabled.length].id);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectValue(enabled[0].id);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectValue(enabled[enabled.length - 1].id);
    }
  };

  return (
    <div className={cn('min-w-0', className)}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className={cn('flex min-w-0 gap-1 rounded-2xl border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-muted)] p-1', tabListClassName)}
      >
        {items.map((item) => {
          const selected = item.id === selectedItem?.id;
          const tabId = `${baseId}-${item.id}-tab`;
          const panelId = `${baseId}-${item.id}-panel`;
          return (
            <button
              key={item.id}
              id={tabId}
              role="tab"
              type="button"
              disabled={item.disabled}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectValue(item.id)}
              className={cn('min-h-10 flex-1 rounded-xl px-3 py-2 text-sm font-bold transition-all ds-focus-ring', selected ? 'bg-[var(--ds-color-surface)] text-[var(--ds-color-text)] shadow-[var(--ds-shadow-xs)]' : 'text-[var(--ds-color-subtle)] hover:text-[var(--ds-color-muted)]', item.disabled && 'cursor-not-allowed opacity-50')}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {selectedItem && (
        <div
          id={`${baseId}-${selectedItem.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-${selectedItem.id}-tab`}
          tabIndex={0}
          className={cn('mt-4 min-w-0 outline-none ds-focus-ring', panelClassName)}
        >
          {selectedItem.content}
        </div>
      )}
    </div>
  );
};

export default memo(Tabs);
