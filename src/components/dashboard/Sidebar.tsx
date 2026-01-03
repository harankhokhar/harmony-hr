import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  CalendarDays, 
  DollarSign, 
  Users, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { role, signOut, profile } = useAuth();
  const navigate = useNavigate();
  const isAdminOrHR = role === 'admin' || role === 'hr';

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard',
      show: true 
    },
    { 
      icon: User, 
      label: 'Profile', 
      path: '/profile',
      show: true 
    },
    { 
      icon: Calendar, 
      label: 'Attendance', 
      path: '/attendance',
      show: true 
    },
    { 
      icon: CalendarDays, 
      label: 'Leave', 
      path: '/leave',
      show: true 
    },
    { 
      icon: DollarSign, 
      label: 'Payroll', 
      path: '/payroll',
      show: true 
    },
    { 
      icon: Users, 
      label: 'Employees', 
      path: '/employees',
      show: isAdminOrHR 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings',
      show: true 
    },
  ];

  const NavItem = ({ icon: Icon, label, path }: { icon: React.ElementType; label: string; path: string }) => {
    const content = (
      <NavLink
        to={path}
        className={({ isActive }) => cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive 
            ? "bg-primary/10 text-primary font-medium" 
            : "text-sidebar-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40",
        "flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 border-b border-sidebar-border px-4",
        collapsed && "justify-center px-2"
      )}>
        <Logo size={collapsed ? 'sm' : 'md'} showText={!collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {navItems.filter(item => item.show).map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
      </nav>

      {/* User Profile Section */}
      <div className={cn(
        "border-t border-sidebar-border p-3",
        collapsed && "flex flex-col items-center"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-medium text-sm">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-muted-foreground capitalize truncate">
                {role}
              </p>
            </div>
          </div>
        )}
        
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                collapsed && "justify-center px-2"
              )}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Sign Out</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="font-medium">
              Sign Out
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border bg-background shadow-sm hover:bg-muted"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>
    </aside>
  );
};

export default Sidebar;
