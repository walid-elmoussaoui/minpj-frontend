import React from 'react';
import { ThemeMode } from '../types/todo';
import { BrandLogoIcon, MoonIcon, SunIcon, LogOutIcon } from './Icons';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onLogout?: () => void;
  user?: any;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onLogout, user }) => {
  return (
    <header
      className="sticky top-0 z-30 h-14 border-b border-[var(--border-subtle)] backdrop-blur-xl transition-colors"
      style={{ backgroundColor: 'var(--header-bg)' }}
    >
      <div className="mx-auto flex h-full max-w-[720px] items-center justify-between gap-4 px-5 sm:px-6">
        <a
          href="/"
          className="inline-flex items-center gap-2.5 text-[17px] font-semibold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0 rounded-lg"
        >
          <BrandLogoIcon className="w-6 h-6 shrink-0" />
          <span>Daymark</span>
        </a>

        <div className="flex items-center gap-2 shrink-0">
          {user && (
            <span className="hidden sm:inline text-[13px] text-[var(--text-muted)]">
              {user.name}
            </span>
          )}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-control)]/60 transition-colors cursor-pointer"
              aria-label="Logout"
              title="Logout"
            >
              <LogOutIcon className="w-[18px] h-[18px]" />
            </button>
          )}
          <PWAInstallButton />
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-control)]/60 transition-colors cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <SunIcon className="w-[18px] h-[18px]" />
            ) : (
              <MoonIcon className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
