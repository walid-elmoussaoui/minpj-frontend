import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { CloseIcon, DownloadIcon } from './Icons';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[var(--accent-text)] bg-[var(--accent-soft)] hover:opacity-85 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
        aria-label="Install Daymark app"
      >
        <DownloadIcon className="w-3.5 h-3.5" />
        <span>Install</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[var(--accent-text)] bg-[var(--accent-soft)] hover:opacity-85 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
        >
          <DownloadIcon className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-sm rounded-[20px] bg-[var(--bg-surface)] p-6 shadow-xl border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between gap-4">
                <h3 id="ios-install-title" className="text-base font-semibold text-[var(--text-primary)]">
                  Install Daymark
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  aria-label="Close install instructions"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
                1. Tap the <strong className="font-medium text-[var(--text-primary)]">Share</strong> button in Safari.
                <br />
                2. Scroll down and tap <strong className="font-medium text-[var(--text-primary)]">Add to Home Screen</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full min-h-[44px] rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
