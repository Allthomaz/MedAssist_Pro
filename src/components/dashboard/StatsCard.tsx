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

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <Card className="premium-stats-card premium-fade-in premium-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide medical-subheading">
            {title}
          </CardTitle>
          <div className="icon-container flex items-center justify-center w-10 h-10">
            <Icon className="w-5 h-5 text-medical-blue" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="value text-3xl font-bold mb-3 medical-heading">
          {value}
        </div>
        <div className="flex items-center gap-2 text-sm">
          {trend && (
            <span
              className={`flex items-center gap-1 font-semibold px-2 py-1 rounded-full text-xs ${
                trend.isPositive
                  ? 'text-medical-success bg-medical-success/10'
                  : 'text-medical-alert bg-medical-alert/10'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}
            </span>
          )}
          <span className="text-muted-foreground medical-subheading">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
