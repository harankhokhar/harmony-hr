import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = 
    today.getMonth() === currentDate.getMonth() && 
    today.getFullYear() === currentDate.getFullYear();

  // Mock data for leaves and holidays
  const leaves = [15, 16, 17];
  const holidays = [26];
  const presentDays = [1, 2, 3, 6, 7, 8, 9, 10, 13, 14];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const getDayStatus = (day: number) => {
    if (holidays.includes(day)) return 'holiday';
    if (leaves.includes(day)) return 'leave';
    if (presentDays.includes(day)) return 'present';
    return 'default';
  };

  const getDayStyles = (day: number, isToday: boolean) => {
    const status = getDayStatus(day);
    
    const baseStyles = "w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors";
    
    if (isToday) {
      return cn(baseStyles, "gradient-bg text-white font-bold");
    }
    
    switch (status) {
      case 'present':
        return cn(baseStyles, "bg-success/10 text-success");
      case 'leave':
        return cn(baseStyles, "bg-accent/10 text-accent");
      case 'holiday':
        return cn(baseStyles, "bg-secondary/10 text-secondary");
      default:
        return cn(baseStyles, "text-foreground hover:bg-muted");
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={previousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {monthYear}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div 
              key={day} 
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDay }).map((_, i) => (
            <div key={`empty-${i}`} className="w-8 h-8" />
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && day === today.getDate();
            
            return (
              <div
                key={day}
                className={getDayStyles(day, isToday)}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-xs text-muted-foreground">Leave</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-xs text-muted-foreground">Holiday</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
