import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'danger';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'bg-card',
    gradient: 'gradient-bg text-white',
    success: 'bg-success/10 border-success/20',
    warning: 'bg-warning/10 border-warning/20',
    danger: 'bg-destructive/10 border-destructive/20',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    gradient: 'bg-white/20 text-white',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-destructive/20 text-destructive',
  };

  return (
    <Card className={cn(
      "border card-hover overflow-hidden",
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-sm font-medium",
              variant === 'gradient' ? 'text-white/80' : 'text-muted-foreground'
            )}>
              {title}
            </p>
            <h3 className={cn(
              "text-3xl font-bold tracking-tight",
              variant === 'gradient' ? 'text-white' : 'text-foreground'
            )}>
              {value}
            </h3>
            {subtitle && (
              <p className={cn(
                "text-xs",
                variant === 'gradient' ? 'text-white/70' : 'text-muted-foreground'
              )}>
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded",
                  trend.value >= 0 
                    ? 'bg-success/10 text-success' 
                    : 'bg-destructive/10 text-destructive'
                )}>
                  {trend.value >= 0 ? '+' : ''}{trend.value}%
                </span>
                <span className={cn(
                  "text-xs",
                  variant === 'gradient' ? 'text-white/60' : 'text-muted-foreground'
                )}>
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-xl",
            iconStyles[variant]
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
