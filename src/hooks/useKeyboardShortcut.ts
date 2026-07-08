import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  ignoreInputFields?: boolean;
}

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target.isContentEditable;
};

export const useKeyboardShortcut = (
  matcher: (event: KeyboardEvent) => boolean,
  callback: (event: KeyboardEvent) => void,
  options: KeyboardShortcutOptions = {}
) => {
  const { enabled = true, preventDefault = true, ignoreInputFields = true } = options;

  useEffect(() => {
    if (!enabled) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (ignoreInputFields && isEditableTarget(event.target)) return;
      if (!matcher(event)) return;
      if (preventDefault) event.preventDefault();
      callback(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback, enabled, ignoreInputFields, matcher, preventDefault]);
};
