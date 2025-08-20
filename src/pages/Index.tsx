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
    <div className="min-h-screen bg-gradient-bg pb-safe">
      {/* iOS-style header with safe area */}
      <div className="sticky top-0 z-10 bg-gradient-bg/95 backdrop-blur-md border-b border-border/10">
        <div className="pt-safe px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Daily Habits
              </h1>
              <p className="text-sm text-muted-foreground">{todayFormatted}</p>
            </div>
            <AddHabitDialog
              categories={categories}
              onAddHabit={handleAddHabit}
              editingHabit={editingHabit}
              onUpdateHabit={handleUpdateHabit}
              onClose={() => setEditingHabit(undefined)}
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* iOS-style stats cards */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-3">

            <Card className="p-3 bg-gradient-card shadow-soft border-0 rounded-2xl">
              <div className="text-center">
                <div className="p-2 rounded-xl bg-primary/10 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Habits</p>
                <p className="text-xl font-bold">{todaysHabits.length}</p>
              </div>
            </Card>

            <Card className="p-3 bg-gradient-card shadow-soft border-0 rounded-2xl">
              <div className="text-center">
                <div className="p-2 rounded-xl bg-success/10 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <p className="text-xs text-muted-foreground">Done</p>
                <p className="text-xl font-bold">{completedToday}</p>
              </div>
            </Card>

            <Card className="p-3 bg-gradient-card shadow-soft border-0 rounded-2xl">
              <div className="text-center">
                <div className="p-2 rounded-xl bg-accent/10 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <p className="text-xs text-muted-foreground">Rate</p>
                <p className="text-xl font-bold">{completionRate}%</p>
              </div>
            </Card>
          </div>
        </div>

        {/* iOS-style Habits List */}
        <div className="space-y-3">
          {todaysHabits.length === 0 ? (
            <Card className="p-8 text-center bg-gradient-card shadow-soft border-0 rounded-2xl">
              <div className="max-w-sm mx-auto">
                <div className="p-4 rounded-full bg-primary/10 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No habits today</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Ready to start your habit journey?
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

        {/* iOS-style Motivational Footer */}
        {todaysHabits.length > 0 && completionRate === 100 && (
          <Card className="mt-6 p-6 text-center bg-gradient-success shadow-success border-0 rounded-2xl">
            <h3 className="text-lg font-bold text-success-foreground mb-2">
              🎉 Perfect Day!
            </h3>
            <p className="text-success-foreground/90 text-sm">
              All habits completed! You're building amazing momentum.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;