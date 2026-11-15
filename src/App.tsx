import React, { useEffect, useMemo, useState } from 'react';
import { AddTaskCard } from './components/AddTaskCard';
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { Header } from './components/Header';
import { OfflineIndicator } from './components/OfflineIndicator';
import { TaskItem } from './components/TaskItem';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Category, Priority, StatusFilter, Task, ThemeMode } from './types/todo';
import {
  getGreetingAndDate,
  formatDueDate,
  isTaskOverdue,
  sanitizeTaskTitle,
} from './utils/storage';
import { taskService } from './api/tasks';
import { categoryService } from './api/categories';
import { preferenceService } from './api/preferences';
import { authService } from './api/auth';

interface ApiTask {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  category_id: number | null;
  position: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  category?: { id: number; name: string; color: string };
}

function apiTaskToTask(apiTask: ApiTask): Task {
  return {
    id: String(apiTask.id),
    title: apiTask.title,
    completed: apiTask.is_completed,
    priority: apiTask.priority,
    category: apiTask.category?.name || 'Personal',
    dueDate: apiTask.due_date,
    createdAt: new Date(apiTask.created_at).getTime(),
  };
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Theme state
  const [theme, setTheme] = useState<ThemeMode>('light');

  // Tasks state from API
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Filter & search state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Drag-and-drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getUser();
      setUser(userData);
      setIsAuthenticated(true);
      await loadTasks();
      await loadCategories();
      await loadPreferences();
    } catch (error) {
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const apiTasks = await taskService.getTasks();
      setTasks(apiTasks.map(apiTaskToTask));
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await categoryService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await preferenceService.getPreferences();
      setTheme(prefs.theme === 'system' ? 'light' : prefs.theme);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle theme toggle
  const handleToggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      await preferenceService.updatePreferences(next);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Event handlers
  const handleAddTask = async (payload: {
    title: string;
    priority: Priority;
    category: Category;
    dueDate: string | null;
  }) => {
    try {
      const category = categories.find((c) => c.name === payload.category);
      const apiTask = await taskService.createTask({
        title: payload.title,
        priority: payload.priority,
        due_date: payload.dueDate,
        category_id: category?.id || null,
      });
      setTasks((prev) => [apiTaskToTask(apiTask), ...prev]);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      const apiTask = await taskService.toggleTask(parseInt(id));
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? apiTaskToTask(apiTask) : task
        )
      );
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleEditTask = async (id: string, nextTitle: string) => {
    try {
      const apiTask = await taskService.updateTask(parseInt(id), { title: nextTitle });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? apiTaskToTask(apiTask) : task
        )
      );
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(parseInt(id));
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await taskService.clearCompleted();
      await loadTasks();
    } catch (error) {
      console.error('Failed to clear completed tasks:', error);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
  };

  // Drag-and-drop handlers
  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      setDropTargetId(targetId);
    }
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDropTargetId(null);
      return;
    }

    const newTasks = [...tasks];
    const fromIndex = newTasks.findIndex((t) => t.id === draggedId);
    const toIndex = newTasks.findIndex((t) => t.id === targetId);

    if (fromIndex === -1 || toIndex === -1) {
      setDraggedId(null);
      setDropTargetId(null);
      return;
    }

    const [moved] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, moved);

    setTasks(newTasks);

    // Save new order to API
    const tasksWithPositions = newTasks.map((task, index) => ({
      id: parseInt(task.id),
      position: index,
    }));

    try {
      await taskService.reorderTasks(tasksWithPositions);
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
      await loadTasks(); // Reload on error
    }

    setDraggedId(null);
    setDropTargetId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTargetId(null);
  };

  // Authentication handlers
  const handleLoginSuccess = (token: string, userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    loadTasks();
    loadCategories();
    loadPreferences();
  };

  const handleRegisterSuccess = (token: string, userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    loadTasks();
    loadCategories();
    loadPreferences();
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
    setTasks([]);
    setCategories([]);
  };

  // Derived metrics & filtered view
  const { greeting, dateLabel } = useMemo(() => getGreetingAndDate(), []);

  const totalCount = tasks.length;
  const completedCount = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks]
  );
  const activeCount = totalCount - completedCount;
  const completionPct =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return tasks.filter((task) => {
      if (statusFilter === 'active' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      if (categoryFilter !== 'all' && task.category !== categoryFilter) {
        return false;
      }
      if (query) {
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesCategory = task.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory) return false;
      }
      return true;
    });
  }, [tasks, statusFilter, categoryFilter, searchQuery]);

  const remainingLabel =
    activeCount === 1 ? '1 task left' : `${activeCount} tasks left`;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setAuthView('register')}
        />
      );
    }
    return (
      <RegisterPage
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setAuthView('login')}
      />
    );
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} onToggleTheme={handleToggleTheme} onLogout={handleLogout} user={user} />

      <main className="flex-1 w-full max-w-[720px] mx-auto px-5 sm:px-6 pt-8 pb-16 sm:pt-12 sm:pb-24">
        {/* Greeting + Date + Progress */}
        <section className="mb-7 sm:mb-9" aria-label="Daily overview">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] sm:text-[34px] font-bold tracking-tight leading-tight text-[var(--text-primary)] [text-wrap:balance]">
                {greeting}
              </h1>
              <p className="mt-1 text-[15px] text-[var(--text-muted)]">
                {dateLabel}
              </p>
            </div>

            {totalCount > 0 && (
              <div className="text-right shrink-0">
                <span className="text-[13px] font-medium text-[var(--text-muted)] tabular-nums">
                  {completionPct}% complete
                </span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div
            className="mt-4 h-1.5 w-full rounded-full bg-[var(--bg-control)] overflow-hidden"
            role="progressbar"
            aria-label="Task completion progress"
            aria-valuenow={completionPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-300 ease-out"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </section>

        {/* Add task card */}
        <section className="mb-7" aria-label="Create task">
          <AddTaskCard onAddTask={handleAddTask} categories={categories.map(c => c.name)} />
        </section>

        {/* Filters & Search */}
        <div className="mb-5">
          <FilterBar
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories.map(c => c.name)}
          />
        </div>

        {/* Task List Surface */}
        <section
          aria-label="Task list"
          className="rounded-[var(--radius-card)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)] border border-[var(--border-subtle)] overflow-hidden transition-colors"
        >
          {filteredTasks.length > 0 ? (
            <ul role="list" className="divide-y-0">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isDragging={draggedId === task.id}
                  isDropTarget={dropTargetId === task.id}
                  onToggle={handleToggleTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              hasTasksAtAll={tasks.length > 0}
              onResetFilters={handleResetFilters}
            />
          )}
        </section>

        {/* Footer row: Counter + Clear completed */}
        <footer className="mt-4 px-1 flex items-center justify-between gap-4 text-[13px] text-[var(--text-muted)]">
          <p aria-live="polite" className="tabular-nums">
            {remainingLabel}
          </p>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={handleClearCompleted}
              className="min-h-[40px] px-3 py-1.5 -mr-2 rounded-full text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-control)]/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Clear completed
            </button>
          )}
        </footer>
      </main>

      <OfflineIndicator />
    </div>
  );
}
