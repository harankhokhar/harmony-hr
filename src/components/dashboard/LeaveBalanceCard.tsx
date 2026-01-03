import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LeaveBalance {
  type: string;
  used: number;
  total: number;
  color: string;
}

const mockLeaveBalances: LeaveBalance[] = [
  { type: 'Paid Leave', used: 5, total: 20, color: 'bg-primary' },
  { type: 'Sick Leave', used: 2, total: 10, color: 'bg-warning' },
  { type: 'Casual Leave', used: 1, total: 5, color: 'bg-secondary' },
];

const LeaveBalanceCard: React.FC = () => {
  const totalUsed = mockLeaveBalances.reduce((sum, leave) => sum + leave.used, 0);
  const totalAvailable = mockLeaveBalances.reduce((sum, leave) => sum + leave.total, 0);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Leave Balance</CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{totalAvailable - totalUsed}</p>
            <p className="text-xs text-muted-foreground">days remaining</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockLeaveBalances.map((leave) => {
          const percentage = (leave.used / leave.total) * 100;
          const remaining = leave.total - leave.used;
          
          return (
            <div key={leave.type} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{leave.type}</span>
                <span className="text-muted-foreground">
                  {remaining} of {leave.total} left
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", leave.color)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Visual breakdown */}
        <div className="pt-4 border-t border-border">
          <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
            {mockLeaveBalances.map((leave, index) => {
              const width = (leave.total / totalAvailable) * 100;
              const usedWidth = (leave.used / leave.total) * width;
              
              return (
                <div 
                  key={leave.type}
                  className={cn("relative", leave.color)}
                  style={{ width: `${usedWidth}%` }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{totalUsed} days used</span>
            <span>{totalAvailable - totalUsed} days remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceCard;
