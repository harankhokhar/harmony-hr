import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CalendarCheck, 
  DollarSign, 
  UserCheck,
  Bell
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'check_in' | 'check_out' | 'leave_approved' | 'leave_rejected' | 'payroll' | 'announcement';
  title: string;
  description: string;
  time: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'check_in',
    title: 'Checked In',
    description: 'You checked in at 9:00 AM',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'leave_approved',
    title: 'Leave Approved',
    description: 'Your leave request for Jan 15-17 was approved',
    time: '5 hours ago',
  },
  {
    id: '3',
    type: 'payroll',
    title: 'Payroll Processed',
    description: 'January salary has been credited',
    time: '1 day ago',
  },
  {
    id: '4',
    type: 'announcement',
    title: 'New Policy Update',
    description: 'Work from home policy has been updated',
    time: '2 days ago',
  },
];

const RecentActivity: React.FC = () => {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'check_in':
      case 'check_out':
        return Clock;
      case 'leave_approved':
      case 'leave_rejected':
        return CalendarCheck;
      case 'payroll':
        return DollarSign;
      case 'announcement':
        return Bell;
      default:
        return UserCheck;
    }
  };

  const getIconColor = (type: Activity['type']) => {
    switch (type) {
      case 'check_in':
        return 'text-success bg-success/10';
      case 'check_out':
        return 'text-warning bg-warning/10';
      case 'leave_approved':
        return 'text-success bg-success/10';
      case 'leave_rejected':
        return 'text-destructive bg-destructive/10';
      case 'payroll':
        return 'text-primary bg-primary/10';
      case 'announcement':
        return 'text-accent bg-accent/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <Badge variant="secondary" className="text-xs">
            Today
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-4">
            {mockActivities.map((activity) => {
              const Icon = getIcon(activity.type);
              const iconColor = getIconColor(activity.type);
              
              return (
                <div key={activity.id} className="relative flex gap-4 pb-4 last:pb-0">
                  {/* Icon */}
                  <div className={`relative z-10 p-2 rounded-full ${iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
