import { createContext, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ResolvedThemeMode, ThemeContextValue, ThemeMode } from '@/types/theme';

const THEME_STORAGE_KEY = 'pulse-theme';
const THEME_SWITCH_CLASS = 'theme-switching';
const THEME_SWITCH_DURATION = 260;
const THEME_VALUES: ThemeMode[] = ['light', 'dark', 'system'];

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const isThemeMode = (value: string | null): value is ThemeMode => Boolean(value && THEME_VALUES.includes(value as ThemeMode));

const getSystemTheme = (): ResolvedThemeMode => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveTheme = (theme: ThemeMode): ResolvedThemeMode => (theme === 'system' ? getSystemTheme() : theme);

const getStoredTheme = () => {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

const persistTheme = (theme: ThemeMode) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    return undefined;
  }
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  const storedTheme = getStoredTheme();
  return isThemeMode(storedTheme) ? storedTheme : 'system';
};

const applyThemeToDocument = (theme: ThemeMode, resolvedTheme: ResolvedThemeMode) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.resolvedTheme = resolvedTheme;
  root.classList.toggle('dark', resolvedTheme === 'dark');
  root.style.colorScheme = resolvedTheme;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedThemeMode>(() => resolveTheme(getInitialTheme()));
  const themeSwitchTimeoutRef = useRef<number | null>(null);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    if (typeof window === 'undefined') return;

    document.documentElement.classList.add(THEME_SWITCH_CLASS);
    persistTheme(nextTheme);
    setThemeState(nextTheme);

    if (themeSwitchTimeoutRef.current) {
      window.clearTimeout(themeSwitchTimeoutRef.current);
    }

    themeSwitchTimeoutRef.current = window.setTimeout(() => {
      document.documentElement.classList.remove(THEME_SWITCH_CLASS);
      themeSwitchTimeoutRef.current = null;
    }, THEME_SWITCH_DURATION);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  useLayoutEffect(() => {
    const nextResolvedTheme = resolveTheme(theme);
    setResolvedTheme(nextResolvedTheme);
    applyThemeToDocument(theme, nextResolvedTheme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return undefined;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const nextResolvedTheme = getSystemTheme();
      setResolvedTheme(nextResolvedTheme);
      applyThemeToDocument('system', nextResolvedTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => () => {
    if (themeSwitchTimeoutRef.current) {
      window.clearTimeout(themeSwitchTimeoutRef.current);
    }
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    setTheme,
    toggleTheme,
  }), [resolvedTheme, setTheme, theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
