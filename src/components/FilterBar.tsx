import React from 'react';
import { CATEGORIES, Category, StatusFilter } from '../types/todo';
import { CloseIcon, SearchIcon } from './Icons';

interface FilterBarProps {
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  categoryFilter: 'all' | Category;
  onCategoryChange: (category: 'all' | Category) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categories?: string[];
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  categories = CATEGORIES,
}) => {
  return (
    <section className="space-y-3" aria-label="Filter and search tasks">
      {/* Row 1: Segmented pill filter + live search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Pill-style segmented control */}
        <div
          role="tablist"
          aria-label="Filter tasks by status"
          className="inline-flex items-center p-1 rounded-full bg-[var(--bg-control)] self-start"
        >
          {STATUS_OPTIONS.map((option) => {
            const active = statusFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onStatusChange(option.value)}
                className={`min-h-[36px] px-4 py-1.5 rounded-full text-[13px] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium shadow-[var(--shadow-segmented)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] font-normal'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Minimal search field */}
        <div className="relative flex-1 sm:max-w-[240px]">
          <label htmlFor="task-search" className="sr-only">
            Search tasks
          </label>
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <SearchIcon className="w-4 h-4" />
          </span>
          <input
            id="task-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="w-full min-h-[44px] sm:min-h-[40px] pl-9 pr-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Category filter buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => onCategoryChange('all')}
          aria-pressed={categoryFilter === 'all'}
          className={`min-h-[36px] px-3.5 py-1 rounded-full text-[13px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            categoryFilter === 'all'
              ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] font-medium'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-control)]/50'
          }`}
        >
          All lists
        </button>
        {categories.map((cat) => {
          const active = categoryFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              aria-pressed={active}
              className={`min-h-[36px] px-3.5 py-1 rounded-full text-[13px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] font-medium'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-control)]/50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </section>
  );
};
