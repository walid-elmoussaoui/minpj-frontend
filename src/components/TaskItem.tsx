import React, { useEffect, useRef, useState } from 'react';
import { Priority, Task } from '../types/todo';
import { formatDueDate, isTaskOverdue, sanitizeTaskTitle } from '../utils/storage';
import { EditIcon, GripIcon, TrashIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  isDragging: boolean;
  isDropTarget: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string, nextTitle: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent<HTMLLIElement>, id: string) => void;
  onDrop: (id: string) => void;
  onDragEnd: () => void;
}

const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'var(--priority-low)' },
  medium: { label: 'Medium', color: 'var(--priority-medium)' },
  high: { label: 'High', color: 'var(--priority-high)' },
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isDragging,
  isDropTarget,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [isRemoving, setIsRemoving] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraftTitle(task.title);
  }, [task.title]);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setDraftTitle(task.title);
    setIsEditing(true);
  };

  const commitEdit = () => {
    const cleaned = sanitizeTaskTitle(draftTitle);
    if (cleaned && cleaned !== task.title) {
      onEdit(task.id, cleaned);
    } else {
      setDraftTitle(task.title);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setDraftTitle(task.title);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  const handleDeleteClick = () => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onDelete(task.id);
      return;
    }

    setIsRemoving(true);
    window.setTimeout(() => {
      onDelete(task.id);
    }, 190);
  };

  const overdue = isTaskOverdue(task.dueDate, task.completed);
  const priorityInfo = PRIORITY_META[task.priority] ?? PRIORITY_META.medium;

  return (
    <li
      draggable={!isEditing}
      onDragStart={() => onDragStart(task.id)}
      onDragOver={(e) => onDragOver(e, task.id)}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(task.id);
      }}
      onDragEnd={onDragEnd}
      className={`task-row-wrapper task-enter border-b border-[var(--border-subtle)] last:border-b-0 ${
        isRemoving ? 'is-removing' : ''
      } ${isDropTarget ? 'border-t-2 border-t-[var(--accent-text)]' : ''}`}
    >
      <div className="task-row-inner">
        <div
          className={`task-row group flex items-start gap-2 px-2 py-2.5 sm:px-3 sm:py-3 transition-colors duration-150 ${
            isDragging ? 'opacity-45' : 'hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          {/* Drag handle (hidden while editing) */}
          <div
            className="hidden sm:flex items-center justify-center min-h-[44px] w-6 text-[var(--text-muted)]/50 group-hover:text-[var(--text-muted)] cursor-grab active:cursor-grabbing shrink-0"
            title="Drag to reorder"
            aria-hidden="true"
          >
            <GripIcon className="w-4 h-4" />
          </div>

          {/* Custom round checkbox with 44x44px touch target */}
          <button
            type="button"
            role="checkbox"
            aria-checked={task.completed}
            aria-label={
              task.completed
                ? `Mark "${task.title}" as incomplete`
                : `Mark "${task.title}" as complete`
            }
            onClick={() => onToggle(task.id)}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full shrink-0 cursor-pointer transition-transform active:scale-95 ${
              task.completed ? 'is-checked' : ''
            }`}
          >
            <span
              className={`w-[22px] h-[22px] rounded-full flex items-center justify-center transition-colors duration-200 ${
                task.completed
                  ? 'bg-[var(--accent)] border border-[var(--accent)]'
                  : 'border-[1.75px] border-[var(--border-strong)] group-hover:border-[var(--accent-text)] bg-transparent'
              }`}
            >
              <svg
                className="w-3 h-3 text-white"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3.5 8.5L6.5 11.5L12.5 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="check-path"
                />
              </svg>
            </span>
          </button>

          {/* Task body: title + unboxed metadata */}
          <div className="flex-1 min-w-0 pt-2">
            {isEditing ? (
              <div>
                <label htmlFor={`edit-${task.id}`} className="sr-only">
                  Edit task title
                </label>
                <input
                  ref={editInputRef}
                  id={`edit-${task.id}`}
                  type="text"
                  value={draftTitle}
                  maxLength={240}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  onBlur={commitEdit}
                  className="w-full rounded-lg bg-[var(--bg-control)]/50 px-2.5 py-1.5 text-[15px] text-[var(--text-primary)] focus:outline-none"
                />
              </div>
            ) : (
              <p
                onDoubleClick={startEditing}
                title="Double-click to edit"
                className={`text-[15px] leading-snug break-words transition-all duration-200 select-text ${
                  task.completed
                    ? 'line-through text-[var(--text-muted)] opacity-65'
                    : 'text-[var(--text-primary)]'
                }`}
              >
                {task.title}
              </p>
            )}

            {/* Clean unboxed inline metadata (Zero-pill discipline) */}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-[var(--text-muted)]">
              <span
                className="inline-flex items-center gap-1.5"
                title={`Priority: ${priorityInfo.label}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: priorityInfo.color }}
                  aria-hidden="true"
                />
                <span>{priorityInfo.label}</span>
              </span>

              <span aria-hidden="true">·</span>
              <span>{task.category}</span>

              {task.dueDate && (
                <>
                  <span aria-hidden="true">·</span>
                  <span
                    className={`tabular-nums ${
                      overdue ? 'font-medium text-[var(--danger)]' : ''
                    }`}
                  >
                    {overdue ? `Overdue · ${formatDueDate(task.dueDate)}` : formatDueDate(task.dueDate)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons (44x44px touch targets) */}
          <div className="task-actions flex items-center shrink-0">
            {!isEditing && (
              <button
                type="button"
                onClick={startEditing}
                aria-label={`Edit "${task.title}"`}
                title="Edit task"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-control)]/60 transition-colors cursor-pointer"
              >
                <EditIcon className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleDeleteClick}
              aria-label={`Delete "${task.title}"`}
              title="Delete task"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors cursor-pointer"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};
