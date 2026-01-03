import React from 'react';
import Logo from '@/components/Logo';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Users, Calendar, BarChart3, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const features = [
  {
    icon: Users,
    title: 'Employee Management',
    description: 'Centralized employee database with comprehensive profiles',
  },
  {
    icon: Calendar,
    title: 'Leave & Attendance',
    description: 'Seamless tracking with automated approvals',
  },
  {
    icon: BarChart3,
    title: 'Payroll Insights',
    description: 'Real-time salary management and analytics',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Role-based access with complete data protection',
  },
];

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Features */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 animated-gradient" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <Logo size="lg" showText={true} className="text-white [&_.gradient-text]:text-white [&_.gradient-text]:bg-none" />
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
                Every workday,<br />
                <span className="text-white/90">perfectly aligned.</span>
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                The complete HR platform for modern organizations. 
                Streamline your workforce management with intelligent automation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="glass-card p-4 bg-white/10 border-white/20 backdrop-blur-md animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <feature.icon className="w-8 h-8 mb-3 text-white/90" />
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-white/60">
            © 2026 CapitaHR. Enterprise-grade HR management.
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col bg-background">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="lg:hidden">
            <Logo size="md" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-auto"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
