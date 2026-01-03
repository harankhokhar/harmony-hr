import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Menu,
  User,
  Settings,
  LogOut,
  Command
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, showMenuButton = false }) => {
  const { theme, toggleTheme } = useTheme();
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {/* Search Bar */}
          <div className="hidden md:flex relative w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 pr-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Live Clock */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-sm font-medium">{formatTime(currentTime)}</span>
            <span className="text-xs text-muted-foreground">{formatDate(currentTime)}</span>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:flex"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs gradient-bg border-2 border-background"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Button variant="ghost" size="sm" className="text-xs h-auto p-1">
                  Mark all read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <p className="text-sm font-medium">Leave Request Approved</p>
                  <p className="text-xs text-muted-foreground">Your leave request for Jan 15-17 has been approved.</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <p className="text-sm font-medium">New Team Member</p>
                  <p className="text-xs text-muted-foreground">Sarah Johnson has joined the Engineering team.</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <p className="text-sm font-medium">Payroll Processed</p>
                  <p className="text-xs text-muted-foreground">January payroll has been processed successfully.</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="gradient-bg text-white font-medium">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  <Badge variant="secondary" className="w-fit capitalize mt-1">
                    {role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
