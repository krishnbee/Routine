import { useState } from 'react';
import { Calendar, TrendingUp, Settings, Target } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from '@/components/HabitCard';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Habit } from '@/types/habit';

const Index = () => {
  const {
    habits,
    categories,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getTodaysHabits
  } = useHabits();

  const { toast } = useToast();
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  
  const todaysHabits = getTodaysHabits();
  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const completedToday = todaysHabits.filter(habit => habit.completions[today]).length;
  const completionRate = todaysHabits.length > 0 ? Math.round((completedToday / todaysHabits.length) * 100) : 0;

  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    addHabit(habitData);
    toast({
      title: "Habit added!",
      description: `"${habitData.title}" has been added to your habits.`,
    });
  };

  const handleUpdateHabit = (id: string, updates: Partial<Habit>) => {
    updateHabit(id, updates);
    setEditingHabit(undefined);
    toast({
      title: "Habit updated!",
      description: "Your habit has been successfully updated.",
    });
  };

  const handleDeleteHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    deleteHabit(id);
    toast({
      title: "Habit deleted",
      description: `"${habit?.title}" has been removed from your habits.`,
      variant: "destructive",
    });
  };

  const handleToggleCompletion = (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId);
    const wasCompleted = habit?.completions[date];
    
    toggleHabitCompletion(habitId, date);
    
    if (!wasCompleted) {
      toast({
        title: "Great job! 🎉",
        description: `You completed "${habit?.title}"!`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Daily Habits
              </h1>
              <p className="text-muted-foreground">{todayFormatted}</p>
            </div>
            <div className="flex gap-2">
              <AddHabitDialog
                categories={categories}
                onAddHabit={handleAddHabit}
                editingHabit={editingHabit}
                onUpdateHabit={handleUpdateHabit}
                onClose={() => setEditingHabit(undefined)}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-gradient-card shadow-soft">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Habits</p>
                  <p className="text-2xl font-bold">{todaysHabits.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-card shadow-soft">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedToday}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-card shadow-soft">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{completionRate}%</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Habits List */}
        <div className="space-y-4">
          {todaysHabits.length === 0 ? (
            <Card className="p-8 text-center bg-gradient-card shadow-soft">
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-full bg-primary/10 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No habits for today</h3>
                <p className="text-muted-foreground mb-4">
                  Start building better habits by adding your first one!
                </p>
                <AddHabitDialog
                  categories={categories}
                  onAddHabit={handleAddHabit}
                  editingHabit={editingHabit}
                  onUpdateHabit={handleUpdateHabit}
                  onClose={() => setEditingHabit(undefined)}
                />
              </div>
            </Card>
          ) : (
            todaysHabits.map((habit) => {
              const category = categories.find(c => c.id === habit.categoryId);
              if (!category) return null;

              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  category={category}
                  date={today}
                  onToggleCompletion={handleToggleCompletion}
                  onEdit={setEditingHabit}
                  onDelete={handleDeleteHabit}
                />
              );
            })
          )}
        </div>

        {/* Motivational Footer */}
        {todaysHabits.length > 0 && completionRate === 100 && (
          <Card className="mt-8 p-6 text-center bg-gradient-success shadow-success">
            <h3 className="text-lg font-bold text-success-foreground mb-2">
              🎉 Perfect Day!
            </h3>
            <p className="text-success-foreground/90">
              You've completed all your habits for today. Keep up the great work!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;