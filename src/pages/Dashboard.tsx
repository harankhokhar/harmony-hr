import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import CalendarWidget from '@/components/dashboard/CalendarWidget';
import LeaveBalanceCard from '@/components/dashboard/LeaveBalanceCard';
import { 
  Calendar, 
  Clock, 
  CalendarDays, 
  Gift,
  Users,
  UserCheck,
  ClipboardList,
  DollarSign
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { profile, role } = useAuth();
  const isAdminOrHR = role === 'admin' || role === 'hr';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Employee stats
  const employeeStats = [
    {
      title: 'Days Present',
      value: '18',
      subtitle: 'This month',
      icon: Calendar,
      trend: { value: 5, label: 'vs last month' },
      variant: 'default' as const,
    },
    {
      title: 'Check-in Time',
      value: '9:00 AM',
      subtitle: 'Today',
      icon: Clock,
      variant: 'gradient' as const,
    },
    {
      title: 'Leave Balance',
      value: '27',
      subtitle: 'Days remaining',
      icon: CalendarDays,
      variant: 'default' as const,
    },
    {
      title: 'Next Holiday',
      value: '23 days',
      subtitle: 'Republic Day',
      icon: Gift,
      variant: 'default' as const,
    },
  ];

  // Admin stats
  const adminStats = [
    {
      title: 'Total Employees',
      value: '156',
      subtitle: 'Active users',
      icon: Users,
      trend: { value: 12, label: 'this quarter' },
      variant: 'default' as const,
    },
    {
      title: 'Present Today',
      value: '142',
      subtitle: '91% attendance',
      icon: UserCheck,
      variant: 'gradient' as const,
    },
    {
      title: 'Pending Approvals',
      value: '8',
      subtitle: 'Leave requests',
      icon: ClipboardList,
      variant: 'warning' as const,
    },
    {
      title: 'Monthly Payroll',
      value: '$284K',
      subtitle: 'January 2026',
      icon: DollarSign,
      variant: 'default' as const,
    },
  ];

  const stats = isAdminOrHR ? adminStats : employeeStats;

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {getGreeting()}, {profile?.first_name || 'there'}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {isAdminOrHR 
            ? "Here's your team overview for today"
            : "Here's what's happening with your work today"
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
            className="animate-fade-in"
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Calendar */}
        <div className="lg:col-span-2 space-y-6">
          <CalendarWidget />
          <RecentActivity />
        </div>

        {/* Right Column - Quick Actions & Leave */}
        <div className="space-y-6">
          <QuickActions />
          <LeaveBalanceCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
