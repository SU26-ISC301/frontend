import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';

const STORAGE_KEY = 'shopvn-theme-mode';

const OPTIONS = [
  { value: 'light', label: 'Sáng', icon: Sun },
  { value: 'dark', label: 'Tối', icon: Moon },
  { value: 'system', label: 'Theo máy', icon: Monitor },
];

function getInitialMode() {
  if (typeof window === 'undefined') return 'system';
  let saved = null;

  try {
    saved = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    saved = null;
  }

  return OPTIONS.some((option) => option.value === saved) ? saved : 'system';
}

function resolveTheme(mode) {
  if (mode !== 'system') return mode;
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [mode, setMode] = useState(getInitialMode);
  const [systemTheme, setSystemTheme] = useState(() => resolveTheme('system'));
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const activeOption = useMemo(
    () => OPTIONS.find((option) => option.value === mode) || OPTIONS[2],
    [mode],
  );
  const ActiveIcon = activeOption.icon;
  const resolvedTheme = mode === 'system' ? systemTheme : mode;

  useEffect(() => {
    if (!window.matchMedia) {
      setSystemTheme('light');
      return undefined;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setSystemTheme(media.matches ? 'dark' : 'light');

    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const theme = resolveTheme(mode);
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');

    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore storage failures; the current page still receives the selected theme.
    }
  }, [mode, systemTheme]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div ref={wrapperRef} className="theme-toggle fixed bottom-5 right-6 z-[90]">
      {open && (
        <div className="theme-toggle-menu mb-2 w-44 overflow-hidden rounded-lg border p-1 shadow-xl backdrop-blur-xl">
          {OPTIONS.map(({ value, label, icon: Icon }) => {
            const selected = mode === value;

            return (
              <button
                key={value}
                type="button"
                className={cn(
                  'theme-toggle-option flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-bold transition-colors',
                  selected && 'is-selected',
                )}
                onClick={() => {
                  setMode(value);
                  setOpen(false);
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{label}</span>
                {selected && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className="theme-toggle-button inline-flex h-11 items-center gap-2 rounded-full border px-3 text-sm font-extrabold shadow-xl backdrop-blur-xl transition-all hover:-translate-y-0.5"
        title={`Nền: ${activeOption.label}`}
        aria-label={`Chuyển nền trang web, hiện tại: ${activeOption.label}`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <ActiveIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{activeOption.label}</span>
        {mode === 'system' && (
          <span className="hidden rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase sm:inline">
            {resolvedTheme === 'dark' ? 'Tối' : 'Sáng'}
          </span>
        )}
      </button>
    </div>
  );
}
