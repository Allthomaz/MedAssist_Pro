import React, { useState } from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Clock,
  Heart,
  Activity,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Download,
  RefreshCw,
  PieChart,
  LineChart,
  BarChart,
  UserCheck,
  CalendarCheck,
  FileCheck,
  Brain,
  Zap,
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const statsData = [
    {
      title: 'Total de Pacientes',
      value: '1,234',
      description: '+12% em relação ao mês anterior',
      icon: Users,
      trend: { value: '+12%', isPositive: true },
    },
    {
      title: 'Consultas Realizadas',
      value: '856',
      description: '+8% em relação ao mês anterior',
      icon: Calendar,
      trend: { value: '+8%', isPositive: true },
    },
    {
      title: 'Documentos Gerados',
      value: '2,341',
      description: '+23% em relação ao mês anterior',
      icon: FileText,
      trend: { value: '+23%', isPositive: true },
    },
    {
      title: 'Tempo Médio de Consulta',
      value: '45min',
      description: '-5min em relação ao mês anterior',
      icon: Clock,
      trend: { value: '-5min', isPositive: true },
    },
  ];

  const performanceMetrics = [
    {
      label: 'Taxa de Satisfação',
      value: '94%',
      icon: Heart,
      color: 'text-green-500',
    },
    {
      label: 'Eficiência de Diagnóstico',
      value: '87%',
      icon: Target,
      color: 'text-blue-500',
    },
    {
      label: 'Tempo de Resposta',
      value: '2.3s',
      icon: Zap,
      color: 'text-yellow-500',
    },
    {
      label: 'Precisão da IA',
      value: '96%',
      icon: Brain,
      color: 'text-purple-500',
    },
  ];

  const recentActivities = [
    {
      type: 'consultation',
      count: 23,
      label: 'Consultas Hoje',
      icon: Activity,
    },
    {
      type: 'documents',
      count: 45,
      label: 'Documentos Gerados',
      icon: FileCheck,
    },
    { type: 'patients', count: 12, label: 'Novos Pacientes', icon: UserCheck },
    {
      type: 'appointments',
      count: 18,
      label: 'Agendamentos',
      icon: CalendarCheck,
    },
  ];

  return (
    <MedicalLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-medical-blue" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">
                Análise detalhada do desempenho e métricas do sistema
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="1y">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
              Atualizar
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Pacientes
            </TabsTrigger>
            <TabsTrigger
              value="consultations"
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Consultas
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Tendência de Consultas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <BarChart className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        Gráfico de tendências
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Distribuição por Especialidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Gráfico de pizza</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 border rounded-lg"
                    >
                      <activity.icon className="w-8 h-8 text-medical-blue" />
                      <div>
                        <p className="text-2xl font-bold">{activity.count}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pacientes */}
          <TabsContent value="patients" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Novos Pacientes por Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto text-green-500 mb-2" />
                      <p className="text-muted-foreground">
                        Crescimento de 15% este mês
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Faixa Etária dos Pacientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>0-18 anos</span>
                      <Badge variant="secondary">23%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>19-35 anos</span>
                      <Badge variant="secondary">34%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>36-60 anos</span>
                      <Badge variant="secondary">28%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>60+ anos</span>
                      <Badge variant="secondary">15%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Consultas */}
          <TabsContent value="consultations" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Consultas por Dia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-medical-blue">28</p>
                    <p className="text-sm text-muted-foreground">
                      Média diária
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Duração Média
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">45min</p>
                    <p className="text-sm text-muted-foreground">
                      Por consulta
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Taxa de Conclusão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-500">94%</p>
                    <p className="text-sm text-muted-foreground">
                      Consultas finalizadas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Métricas de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {performanceMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="text-center p-4 border rounded-lg"
                    >
                      <metric.icon
                        className={`w-8 h-8 mx-auto mb-2 ${metric.color}`}
                      />
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-muted-foreground">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Metas e Objetivos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Consultas mensais</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">856/900</Badge>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Satisfação do paciente</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">94%/90%</Badge>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tempo de resposta</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">2.3s/3s</Badge>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Alertas e Notificações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Consultas em atraso</p>
                      <p className="text-xs text-muted-foreground">
                        3 consultas precisam de atenção
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Sistema funcionando</p>
                      <p className="text-xs text-muted-foreground">
                        Todos os serviços operacionais
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MedicalLayout>
  );
}
