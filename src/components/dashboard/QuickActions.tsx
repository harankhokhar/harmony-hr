import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CalendarPlus, 
  FileText, 
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const isAdminOrHR = role === 'admin' || role === 'hr';

  const employeeActions = [
    {
      icon: Clock,
      label: 'Check In/Out',
      description: 'Mark your attendance',
      action: () => navigate('/attendance'),
      color: 'text-primary bg-primary/10',
    },
    {
      icon: CalendarPlus,
      label: 'Apply Leave',
      description: 'Submit leave request',
      action: () => navigate('/leave'),
      color: 'text-secondary bg-secondary/10',
    },
    {
      icon: FileText,
      label: 'View Payslip',
      description: 'Download payslip',
      action: () => navigate('/payroll'),
      color: 'text-accent bg-accent/10',
    },
  ];

  const adminActions = [
    {
      icon: UserPlus,
      label: 'Add Employee',
      description: 'Register new employee',
      action: () => navigate('/employees'),
      color: 'text-success bg-success/10',
    },
    {
      icon: CalendarPlus,
      label: 'Approve Leave',
      description: 'Review pending requests',
      action: () => navigate('/leave'),
      color: 'text-warning bg-warning/10',
    },
  ];

  const actions = isAdminOrHR 
    ? [...employeeActions, ...adminActions]
    : employeeActions;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            onClick={action.action}
            className="w-full justify-between h-auto py-3 px-4 hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
