import { Task } from '../types/todo';

const TASKS_STORAGE_KEY = 'daymark_tasks_v1';
const INIT_STORAGE_KEY = 'daymark_initialized_v1';
const THEME_STORAGE_KEY = 'daymark_theme';

/**
 * Returns local YYYY-MM-DD string offset by a number of days from today.
 */
export function getRelativeDateISO(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Realistic starter tasks shown once on first visit.
 */
export function getSampleTasks(): Task[] {
  const now = Date.now();
  return [
    {
      id: 'sample-1',
      title: 'Finalize Q4 product roadmap notes',
      completed: false,
      priority: 'high',
      category: 'Work',
      dueDate: getRelativeDateISO(0),
      createdAt: now - 3600_000 * 3,
    },
    {
      id: 'sample-2',
      title: 'Read chapter 4 on cognitive ergonomics',
      completed: false,
      priority: 'medium',
      category: 'Study',
      dueDate: getRelativeDateISO(2),
      createdAt: now - 3600_000 * 2,
    },
    {
      id: 'sample-3',
      title: 'Return library books before late fee',
      completed: false,
      priority: 'low',
      category: 'Personal',
      dueDate: getRelativeDateISO(-1),
      createdAt: now - 3600_000,
    },
  ];
}

/**
 * Loads tasks from localStorage, or seeds 3 sample tasks on very first load.
 */
export function loadTasks(): Task[] {
  try {
    const initialized = localStorage.getItem(INIT_STORAGE_KEY);
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);

    if (!initialized && !raw) {
      const samples = getSampleTasks();
      localStorage.setItem(INIT_STORAGE_KEY, '1');
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(samples));
      return samples;
    }

    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is Task =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.completed === 'boolean'
    );
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(INIT_STORAGE_KEY, '1');
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadSavedTheme(): 'light' | 'dark' | null {
  try {
    const val = localStorage.getItem(THEME_STORAGE_KEY);
    return val === 'light' || val === 'dark' ? val : null;
  } catch {
    return null;
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Checks whether an incomplete task's due date is strictly before today.
 */
export function isTaskOverdue(dueDate: string | null, completed: boolean): boolean {
  if (!dueDate || completed) return false;
  const todayISO = getRelativeDateISO(0);
  return dueDate < todayISO;
}

/**
 * Formats a YYYY-MM-DD date string into a friendly relative/short label.
 */
export function formatDueDate(dueDate: string): string {
  const todayISO = getRelativeDateISO(0);
  const tomorrowISO = getRelativeDateISO(1);
  const yesterdayISO = getRelativeDateISO(-1);

  if (dueDate === todayISO) return 'Today';
  if (dueDate === tomorrowISO) return 'Tomorrow';
  if (dueDate === yesterdayISO) return 'Yesterday';

  const [y, m, d] = dueDate.split('-').map(Number);
  if (!y || !m || !d) return dueDate;
  const parsed = new Date(y, m - 1, d);
  const sameYear = y === new Date().getFullYear();

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

/**
 * Returns calm greeting and formatted today's date (e.g., "Saturday, 14 November").
 */
export function getGreetingAndDate(now: Date = new Date()): { greeting: string; dateLabel: string } {
  const hour = now.getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
  const day = now.getDate();
  const month = now.toLocaleDateString('en-US', { month: 'long' });

  return {
    greeting,
    dateLabel: `${weekday}, ${day} ${month}`,
  };
}

/**
 * Sanitizes plain text input by trimming and collapsing control characters.
 */
export function sanitizeTaskTitle(raw: string): string {
  return raw.replace(/[\u0000-\u001F\u007F]/g, '').trim();
}
