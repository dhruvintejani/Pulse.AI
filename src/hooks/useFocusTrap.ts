import { RefObject, useEffect } from 'react';

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

export const getFocusableElements = (element: HTMLElement | null) => {
  if (!element) return [] as HTMLElement[];
  return Array.from(element.querySelectorAll<HTMLElement>(focusableSelector)).filter((node) => {
    const style = window.getComputedStyle(node);
    return style.visibility !== 'hidden' && style.display !== 'none' && !node.hasAttribute('aria-hidden');
  });
};

export const useFocusTrap = (containerRef: RefObject<HTMLElement>, enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableElements = getFocusableElements(container);
    const firstFocusable = focusableElements[0] ?? container;
    firstFocusable.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const elements = getFocusableElements(container);
      if (!elements.length) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [containerRef, enabled]);
};
