import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card className="medical-card-hover bg-card/50 dark:bg-card/30 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {trend && (
            <span className={`flex items-center gap-1 ${trend.isPositive ? 'text-medical-success' : 'text-medical-alert'}`}>
              {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {trend.value}
            </span>
          )}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}