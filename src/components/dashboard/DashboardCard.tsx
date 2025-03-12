
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent';
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  variant = 'default',
  className,
}) => {
  return (
    <Card className={cn(
      'overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md',
      variant === 'primary' && 'border-primary/20 bg-primary/5',
      variant === 'accent' && 'border-accent/20 bg-accent/5',
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className={cn(
            'p-2 rounded-full',
            variant === 'default' && 'bg-secondary text-primary',
            variant === 'primary' && 'bg-primary/10 text-primary',
            variant === 'accent' && 'bg-accent/10 text-accent',
          )}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold tracking-tight">{value}</span>
            {trend && (
              <span className={cn(
                'text-xs font-medium flex items-center',
                trend.isPositive ? 'text-green-500' : 'text-red-500'
              )}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
