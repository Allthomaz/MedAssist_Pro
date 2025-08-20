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
    <Card className="medical-card-hover bg-card border-border/60 hover:border-border transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </CardTitle>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold text-foreground mb-2">{value}</div>
        <div className="flex items-center gap-2 text-sm">
          {trend && (
            <span className={`flex items-center gap-1 font-medium ${
              trend.isPositive ? 'text-medical-success' : 'text-medical-alert'
            }`}>
              {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}
            </span>
          )}
          <span className="text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}