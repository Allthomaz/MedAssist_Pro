import React from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Users, Video, FileText, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';

const Index = () => {
  const { fullDisplayName, professionName } = useProfile();

  return (
    <MedicalLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-base">
              Bem-vindo de volta, {fullDisplayName}.
            </p>
            <p className="text-sm text-muted-foreground">
              {professionName}
            </p>
          </div>
          <Button className="medical-gradient medical-glow text-white shadow-lg hover:shadow-xl transition-all duration-200 w-fit">
            Nova Consulta
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Pacientes"
            value="247"
            description="Pacientes cadastrados"
            icon={Users}
            trend={{ value: "+12%", isPositive: true }}
          />
          <StatsCard
            title="Consultas Hoje"
            value="8"
            description="Consultas agendadas"
            icon={Video}
            trend={{ value: "+2", isPositive: true }}
          />
          <StatsCard
            title="Documentos Pendentes"
            value="3"
            description="Aguardando aprovação"
            icon={FileText}
            trend={{ value: "-1", isPositive: false }}
          />
          <StatsCard
            title="Tempo Médio"
            value="12min"
            description="Por documento gerado"
            icon={Clock}
            trend={{ value: "-2min", isPositive: false }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <QuickActions />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>
    </MedicalLayout>
  );
};

export default Index;
