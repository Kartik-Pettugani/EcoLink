import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="inline-flex items-center justify-center rounded-md border border-(--border) bg-(--card) px-3 py-2 text-sm font-medium text-(--fg) shadow-sm hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
