import { useState, useEffect } from 'react';
import { Habit, Category } from '@/types/habit';

const STORAGE_KEYS = {
  HABITS: 'habit-tracker-habits',
  CATEGORIES: 'habit-tracker-categories'
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Health', color: '#22c55e' },
  { id: '2', name: 'Productivity', color: '#3b82f6' },
  { id: '3', name: 'Learning', color: '#f59e0b' },
  { id: '4', name: 'Personal', color: '#ec4899' },
];

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  // Load data from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem(STORAGE_KEYS.HABITS);
    const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    }
  }, [habits]);

  // Save categories to localStorage
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
  }, [categories]);

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completions: {}
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newCompletions = { ...habit.completions };
        newCompletions[date] = !newCompletions[date];
        return { ...habit, completions: newCompletions };
      }
      return habit;
    }));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID()
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory.id;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const deleteCategory = (id: string) => {
    // Move habits to first category before deleting
    const firstCategoryId = categories[0]?.id;
    if (firstCategoryId) {
      setHabits(prev => prev.map(habit => 
        habit.categoryId === id ? { ...habit, categoryId: firstCategoryId } : habit
      ));
    }
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const getHabitsForDate = (date: string) => {
    const dayOfWeek = new Date(date).getDay();
    return habits.filter(habit => {
      if (habit.frequency === 'daily') return true;
      if (habit.frequency === 'weekly') {
        return habit.weekDays?.includes(dayOfWeek) ?? false;
      }
      return false;
    });
  };

  const getTodaysHabits = () => {
    const today = new Date().toISOString().split('T')[0];
    return getHabitsForDate(today);
  };

  return {
    habits,
    categories,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    addCategory,
    updateCategory,
    deleteCategory,
    getHabitsForDate,
    getTodaysHabits
  };
}