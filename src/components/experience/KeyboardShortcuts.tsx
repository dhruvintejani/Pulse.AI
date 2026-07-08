import { memo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_PATHS, ROUTES } from '@/constants/routes';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useTheme } from '@/hooks/useTheme';

const sequenceTimeoutMs = 900;

const KeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const sequenceRef = useRef<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearSequence = useCallback(() => {
    sequenceRef.current = null;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  useKeyboardShortcut(
    (event) => (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j',
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    { ignoreInputFields: false }
  );

  useEffect(() => {
    const routes: Record<string, string> = {
      h: ROUTES.HOME,
      d: DASHBOARD_PATHS.ROOT,
      c: DASHBOARD_PATHS.CHAT,
      f: DASHBOARD_PATHS.DOCUMENTS,
      a: DASHBOARD_PATHS.ANALYTICS,
      n: DASHBOARD_PATHS.NOTIFICATIONS,
      s: DASHBOARD_PATHS.SETTINGS,
      p: DASHBOARD_PATHS.PROFILE,
      b: DASHBOARD_PATHS.BILLING,
      t: DASHBOARD_PATHS.TEAM,
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable) return;
      }

      const key = event.key.toLowerCase();
      if (key === 'g') {
        sequenceRef.current = 'g';
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(clearSequence, sequenceTimeoutMs);
        return;
      }

      if (sequenceRef.current === 'g' && routes[key]) {
        event.preventDefault();
        navigate(routes[key]);
        clearSequence();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearSequence();
    };
  }, [clearSequence, navigate]);

  return null;
};

export default memo(KeyboardShortcuts);
