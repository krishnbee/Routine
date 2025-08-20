export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  frequency: 'daily' | 'weekly';
  weekDays?: number[]; // For weekly habits: 0=Sunday, 1=Monday, etc.
  completions: Record<string, boolean>; // date string -> completed
  createdAt: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string;
  completed: boolean;
}