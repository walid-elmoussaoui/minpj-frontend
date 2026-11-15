import React, { useState } from 'react';
import { CATEGORIES, Category, Priority } from '../types/todo';
import { sanitizeTaskTitle } from '../utils/storage';
import { CalendarIcon } from './Icons';

interface AddTaskCardProps {
  onAddTask: (payload: {
    title: string;
    priority: Priority;
    category: Category;
    dueDate: string | null;
  }) => void;
  categories?: string[];
}

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'var(--priority-low)' },
  { value: 'medium', label: 'Medium', color: 'var(--priority-medium)' },
  { value: 'high', label: 'High', color: 'var(--priority-high)' },
];

export const AddTaskCard: React.FC<AddTaskCardProps> = ({ onAddTask, categories = CATEGORIES }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>(categories[0] as Category);
  const [dueDate, setDueDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = sanitizeTaskTitle(title);
    if (!cleaned) return;

    onAddTask({
      title: cleaned,
      priority,
      category,
      dueDate: dueDate || null,
    });

    setTitle('');
    setDueDate('');
    setPriority('medium');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[var(--radius-card)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)] border border-[var(--border-subtle)] transition-colors"
      aria-label="Add a new task"
    >
      {/* Top input row */}
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
        <label htmlFor="new-task-input" className="sr-only">
          New task title
        </label>
        <input
          id="new-task-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          maxLength={240}
          className="w-full min-h-[44px] bg-transparent text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!sanitizeTaskTitle(title)}
          className="min-h-[40px] px-5 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Add
        </button>
      </div>

      {/* Subtle hairline divider and compact options row */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[var(--border-subtle)] px-4 py-2.5 sm:px-5 text-[13px]">
        {/* Priority selector */}
        <div className="flex items-center gap-1" role="group" aria-label="Task priority">
          <span className="text-[var(--text-muted)] mr-1.5 select-none">Priority</span>
          {PRIORITIES.map((item) => {
            const active = priority === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setPriority(item.value)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 min-h-[34px] px-2.5 py-1 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[var(--bg-control)] text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category & Due date */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label htmlFor="new-task-category" className="text-[var(--text-muted)]">
              List
            </label>
            <select
              id="new-task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="min-h-[34px] rounded-lg bg-transparent px-1.5 py-1 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-control)]/50 transition-colors cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label
              htmlFor="new-task-due"
              className="inline-flex items-center gap-1 text-[var(--text-muted)] cursor-pointer"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="sr-only">Due date</span>
            </label>
            <input
              id="new-task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
              className="min-h-[34px] rounded-lg bg-transparent px-1.5 py-1 text-[13px] text-[var(--text-primary)] tabular-nums hover:bg-[var(--bg-control)]/50 transition-colors cursor-pointer"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
