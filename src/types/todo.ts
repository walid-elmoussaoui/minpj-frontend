export type Priority = 'low' | 'medium' | 'high';

export type StatusFilter = 'all' | 'active' | 'completed';

/**
 * Add or customize categories here.
 * Keep labels short and scannable.
 */
export const CATEGORIES = ['Work', 'Personal', 'Study'] as const;

export type Category = (typeof CATEGORIES)[number] | string;

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate: string | null; // YYYY-MM-DD or null
  createdAt: number;
}

export type ThemeMode = 'light' | 'dark';
