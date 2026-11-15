import React from 'react';
import { EmptyIllustration } from './Icons';

interface EmptyStateProps {
  hasTasksAtAll: boolean;
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasTasksAtAll,
  onResetFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="text-[var(--text-muted)] mb-4">
        <EmptyIllustration className="w-20 h-20" />
      </div>

      {hasTasksAtAll ? (
        <>
          <p className="text-[15px] font-medium text-[var(--text-primary)]">
            No matching tasks
          </p>
          <p className="mt-1 text-[13px] text-[var(--text-muted)]">
            Try clearing your search or switching filters.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 min-h-[40px] px-4 py-1.5 rounded-full text-[13px] font-medium text-[var(--accent-text)] hover:bg-[var(--accent-soft)] transition-colors cursor-pointer"
          >
            Reset filters
          </button>
        </>
      ) : (
        <>
          <p className="text-[16px] font-medium text-[var(--text-primary)]">
            Nothing to do. Enjoy your day.
          </p>
          <p className="mt-1 text-[13px] text-[var(--text-muted)]">
            Capture a task above whenever something comes to mind.
          </p>
        </>
      )}
    </div>
  );
};
