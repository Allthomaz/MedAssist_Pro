import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatsCard } from '@/components/dashboard/StatsCard';
import {
  Users,
  Activity,
  Calendar,
  TrendingUp,
  Heart,
  Stethoscope,
  FileText,
  Settings,
  Bell,
  Search,
} from 'lucide-react';

export function DesignShowcase() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 premium-fade-in">
          <h1 className="text-4xl font-bold medical-heading">
            Design System Premium
          </h1>
          <p className="text-xl medical-subheading max-w-2xl mx-auto">
            Demonstração das melhorias visuais implementadas no Doctor Brief AI
          </p>
        </div>

        {/* Stats Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold medical-heading premium-fade-in">
            Cards de Estatísticas Premium
          </h2>
          <div className="medical-grid">
            <StatsCard
              title="Total de Pacientes"
              value="1,247"
              description="este mês"
              icon={Users}
              trend={{ value: '+12%', isPositive: true }}
            />
            <StatsCard
              title="Consultas Realizadas"
              value="89"
              description="esta semana"
              icon={Activity}
              trend={{ value: '+8%', isPositive: true }}
            />
            <StatsCard
              title="Agendamentos"
              value="156"
              description="próximos 7 dias"
              icon={Calendar}
              trend={{ value: '-3%', isPositive: false }}
            />
            <StatsCard
              title="Taxa de Satisfação"
              value="98.5%"
              description="média mensal"
              icon={Heart}
              trend={{ value: '+2.1%', isPositive: true }}
            />
          </div>
        </section>

        {/* Premium Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold medical-heading premium-fade-in">
            Cards Premium com Elevação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="premium-card premium-fade-in">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-medical-blue/10">
                    <Stethoscope className="w-6 h-6 text-medical-blue" />
                  </div>
                  <div>
                    <CardTitle className="medical-heading">
                      Diagnósticos
                    </CardTitle>
                    <p className="text-sm medical-subheading">
                      Sistema inteligente
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="medical-subheading">
                  IA avançada para auxiliar no diagnóstico médico com precisão e
                  rapidez.
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card premium-fade-in">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-medical-success/10">
                    <FileText className="w-6 h-6 text-medical-success" />
                  </div>
                  <div>
                    <CardTitle className="medical-heading">
                      Relatórios
                    </CardTitle>
                    <p className="text-sm medical-subheading">
                      Geração automática
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="medical-subheading">
                  Criação automática de relatórios médicos detalhados e
                  personalizados.
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card premium-fade-in">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-medical-alert/10">
                    <Bell className="w-6 h-6 text-medical-alert" />
                  </div>
                  <div>
                    <CardTitle className="medical-heading">Alertas</CardTitle>
                    <p className="text-sm medical-subheading">
                      Notificações inteligentes
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="medical-subheading">
                  Sistema de alertas para medicações, consultas e procedimentos.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold medical-heading premium-fade-in">
            Botões Premium com Micro-interações
          </h2>
          <div className="flex flex-wrap gap-4 premium-fade-in">
            <Button className="premium-button bg-medical-blue hover:bg-medical-blue/90">
              <Activity className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
            <Button
              variant="outline"
              className="premium-button border-medical-blue text-medical-blue hover:bg-medical-blue/10"
            >
              <Users className="w-4 h-4 mr-2" />
              Gerenciar Pacientes
            </Button>
            <Button variant="secondary" className="premium-button">
              <FileText className="w-4 h-4 mr-2" />
              Relatórios
            </Button>
            <Button
              variant="ghost"
              className="premium-button text-medical-success hover:bg-medical-success/10"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </section>

        {/* Form Elements Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold medical-heading premium-fade-in">
            Campos de Entrada Médicos
          </h2>
          <Card className="premium-card premium-fade-in max-w-2xl">
            <CardHeader>
              <CardTitle className="medical-heading">
                Formulário de Paciente
              </CardTitle>
              <p className="medical-subheading">
                Campos com design sofisticado
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="medical-subheading font-medium"
                  >
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    placeholder="Digite o nome do paciente"
                    className="medical-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="age"
                    className="medical-subheading font-medium"
                  >
                    Idade
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Idade"
                    className="medical-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="diagnosis"
                  className="medical-subheading font-medium"
                >
                  Diagnóstico Preliminar
                </Label>
                <Input
                  id="diagnosis"
                  placeholder="Descreva o diagnóstico"
                  className="medical-input"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="premium-button bg-medical-blue hover:bg-medical-blue/90">
                  Salvar Paciente
                </Button>
                <Button variant="outline" className="premium-button">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Search Bar Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold medical-heading premium-fade-in">
            Barra de Pesquisa Premium
          </h2>
          <div className="max-w-2xl premium-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Pesquisar pacientes, consultas, documentos..."
                className="medical-input pl-10 h-12 text-base"
              />
            </div>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold medical-heading premium-fade-in">
            Paleta de Cores Médica
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 premium-fade-in">
            <div className="space-y-2">
              <div className="w-full h-20 rounded-xl bg-medical-blue shadow-lg"></div>
              <p className="text-sm font-medium medical-subheading">
                Medical Blue
              </p>
              <p className="text-xs text-muted-foreground">#3498DB</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 rounded-xl bg-medical-success shadow-lg"></div>
              <p className="text-sm font-medium medical-subheading">
                Medical Success
              </p>
              <p className="text-xs text-muted-foreground">#2ECC71</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 rounded-xl bg-medical-alert shadow-lg"></div>
              <p className="text-sm font-medium medical-subheading">
                Medical Alert
              </p>
              <p className="text-xs text-muted-foreground">#E74C3C</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 rounded-xl bg-primary shadow-lg"></div>
              <p className="text-sm font-medium medical-subheading">
                Primary Navy
              </p>
              <p className="text-xs text-muted-foreground">#2C3E50</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-8 premium-fade-in">
          <p className="medical-subheading">
            Design System Premium implementado com foco em elegância e
            funcionalidade médica
          </p>
        </div>
      </div>
    </div>
  );
}
