import React from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Users, Video, FileText, Clock, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <MedicalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao MedAssist Pro. Gerencie suas consultas e documentos médicos.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Pacientes"
            value="247"
            description="Pacientes cadastrados"
            icon={Users}
            trend={{ value: "12%", isPositive: true }}
          />
          <StatsCard
            title="Consultas Hoje"
            value="8"
            description="Consultas agendadas"
            icon={Video}
            trend={{ value: "2", isPositive: true }}
          />
          <StatsCard
            title="Documentos Pendentes"
            value="3"
            description="Aguardando aprovação"
            icon={FileText}
            trend={{ value: "1", isPositive: false }}
          />
          <StatsCard
            title="Tempo Médio"
            value="12min"
            description="Por documento gerado"
            icon={Clock}
            trend={{ value: "25%", isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <QuickActions />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center gap-4 justify-between flex-wrap">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg medical-gradient">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Conecte ao Supabase</h3>
                <p className="text-sm text-muted-foreground">
                  Para ativar autenticação, banco de dados e integração com IA, conecte seu projeto ao Supabase clicando no botão verde no canto superior direito.
                </p>
              </div>
            </div>
            <a href="/auth" className="text-sm underline text-primary">Fazer login / criar conta</a>
          </div>
        </div>
      </div>
    </MedicalLayout>
  );
};

export default Index;
