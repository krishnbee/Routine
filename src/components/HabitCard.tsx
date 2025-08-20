import { useState } from 'react';
import { CheckCircle2, Circle, Edit3, Trash2 } from 'lucide-react';
import { Habit, Category } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  category: Category;
  date: string;
  onToggleCompletion: (habitId: string, date: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export function HabitCard({ 
  habit, 
  category, 
  date, 
  onToggleCompletion, 
  onEdit, 
  onDelete 
}: HabitCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = habit.completions[date] ?? false;

  const handleToggleCompletion = () => {
    onToggleCompletion(habit.id, date);
  };

  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-300 cursor-pointer bg-gradient-card border-0 shadow-soft hover:shadow-hover rounded-2xl touch-feedback",
        isCompleted && "bg-gradient-success border border-success/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleToggleCompletion}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center">
          {isCompleted ? (
            <CheckCircle2 
              className="w-7 h-7 text-success-foreground animate-bounce-in" 
            />
          ) : (
            <Circle className="w-7 h-7 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-semibold text-base transition-all duration-300",
              isCompleted ? "text-success-foreground line-through" : "text-foreground"
            )}>
              {habit.title}
            </h3>
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
          </div>
          
          {habit.description && (
            <p className={cn(
              "text-sm transition-all duration-300 mb-2",
              isCompleted ? "text-success-foreground/70" : "text-muted-foreground"
            )}>
              {habit.description}
            </p>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {habit.frequency}
            </span>
            <span className="text-xs text-muted-foreground">
              {category.name}
            </span>
          </div>
        </div>

        {isHovered && (
          <div className="flex gap-1 opacity-0 animate-bounce-in">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(habit);
              }}
              className="h-10 w-10 p-0 hover:bg-primary/10 rounded-xl touch-feedback"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(habit.id);
              }}
              className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive rounded-xl touch-feedback"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}