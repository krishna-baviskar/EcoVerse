'use client';
import {
  Card,
  CardContent,
  CardHeader, 
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  className?: string;
  gaugeValue?: number; // 0-100
  gaugeColor?: string;
}

export function OverviewCard({
  title,
  value,
  icon: Icon,
  description,
  className,
  gaugeValue,
  gaugeColor,
}: OverviewCardProps) {
  const getGaugeColor = (value: number | undefined) => {
    if (value === undefined) return 'bg-primary';
    if (value > 75) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const colorClass = gaugeColor || getGaugeColor(gaugeValue);

  return (
    <Card className={cn("hover:shadow-lg transition-shadow flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {gaugeValue !== undefined && (
          <div className="mt-auto pt-4">
             <Progress value={gaugeValue} indicatorClassName={colorClass} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
