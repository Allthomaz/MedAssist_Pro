# Módulo de Dashboard

Este módulo fornece uma visão centralizada e interativa dos dados médicos, estatísticas e métricas do sistema Doctor Brief AI, oferecendo insights valiosos para médicos e administradores.

## Visão Geral

O módulo de dashboard é responsável por:
- Visualização de métricas em tempo real
- Gráficos e relatórios interativos
- Resumos estatísticos de pacientes e consultas
- Indicadores de performance (KPIs)
- Alertas e notificações importantes
- Análise de tendências e padrões

## Arquitetura de Componentes

### Estrutura Hierárquica
```
Dashboard
├── Header (métricas principais)
├── QuickStats (estatísticas rápidas)
├── Charts (gráficos interativos)
│   ├── PatientGrowthChart
│   ├── ConsultationTrendsChart
│   ├── RevenueChart
│   └── PerformanceMetrics
├── RecentActivity (atividades recentes)
├── Alerts (alertas e notificações)
└── QuickActions (ações rápidas)
```

### Responsividade
- **Desktop**: Layout em grid 3x3 com componentes expansíveis
- **Tablet**: Layout 2x4 com componentes redimensionados
- **Mobile**: Layout vertical com componentes empilhados

## Interfaces de Dados

### DashboardData Interface
```typescript
interface DashboardData {
  // Métricas Principais
  overview: OverviewMetrics;
  
  // Dados de Gráficos
  charts: {
    patientGrowth: PatientGrowthData[];
    consultationTrends: ConsultationTrendData[];
    revenue: RevenueData[];
    performance: PerformanceData;
  };
  
  // Atividades Recentes
  recentActivity: ActivityItem[];
  
  // Alertas
  alerts: AlertItem[];
  
  // Período de Dados
  dateRange: {
    start: Date;
    end: Date;
  };
  
  // Última Atualização
  lastUpdated: Date;
}
```

### OverviewMetrics Interface
```typescript
interface OverviewMetrics {
  // Pacientes
  totalPatients: number;
  newPatientsThisMonth: number;
  patientGrowthRate: number; // percentual
  
  // Consultas
  totalConsultations: number;
  consultationsThisMonth: number;
  consultationGrowthRate: number;
  
  // Transcrições
  totalTranscriptions: number;
  transcriptionsThisMonth: number;
  averageTranscriptionTime: number; // em segundos
  
  // Receita (se aplicável)
  totalRevenue?: number;
  revenueThisMonth?: number;
  revenueGrowthRate?: number;
  
  // Performance
  systemUptime: number; // percentual
  averageResponseTime: number; // em ms
  errorRate: number; // percentual
}
```

### ChartData Interfaces
```typescript
interface PatientGrowthData {
  date: string;
  newPatients: number;
  totalPatients: number;
  growthRate: number;
}

interface ConsultationTrendData {
  date: string;
  consultations: number;
  transcriptions: number;
  averageDuration: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  consultations: number;
  averageValue: number;
}

interface PerformanceData {
  cpu: number;
  memory: number;
  storage: number;
  bandwidth: number;
  responseTime: number[];
  errorCount: number[];
}
```

### ActivityItem Interface
```typescript
interface ActivityItem {
  id: string;
  type: 'patient_created' | 'consultation_completed' | 'transcription_finished' | 'report_generated';
  title: string;
  description: string;
  timestamp: Date;
  userId: string;
  userName: string;
  metadata?: {
    patientId?: string;
    consultationId?: string;
    duration?: number;
    status?: string;
  };
}
```

### AlertItem Interface
```typescript
interface AlertItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  expiresAt?: Date;
}
```

## Componentes Principais

### DashboardOverview.tsx
**Propósito**: Componente principal que orquestra todo o dashboard.

**Funcionalidades**:
- ✅ Carregamento assíncrono de dados
- ✅ Atualização automática em tempo real
- ✅ Filtros de período personalizáveis
- ✅ Export de dados em PDF/Excel
- ✅ Modo de apresentação (fullscreen)
- ✅ Personalização de layout

**Estrutura**:
```tsx
const DashboardOverview: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 segundos
  
  // Auto-refresh dos dados
  useEffect(() => {
    const interval = setInterval(() => {
      refreshDashboardData();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);
  
  // Carregamento inicial
  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);
  
  return (
    <div className="dashboard-container">
      <DashboardHeader 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onRefresh={refreshDashboardData}
        onExport={exportDashboard}
      />
      
      <div className="dashboard-grid">
        <QuickStatsCards metrics={dashboardData?.overview} />
        <PatientGrowthChart data={dashboardData?.charts.patientGrowth} />
        <ConsultationTrendsChart data={dashboardData?.charts.consultationTrends} />
        <RecentActivityFeed activities={dashboardData?.recentActivity} />
        <AlertsPanel alerts={dashboardData?.alerts} />
        <PerformanceMetrics data={dashboardData?.charts.performance} />
      </div>
    </div>
  );
};
```

### QuickStatsCards.tsx
**Propósito**: Exibe métricas principais em cards visuais.

**Funcionalidades**:
- ✅ Animações de contadores
- ✅ Indicadores de tendência (↑↓)
- ✅ Cores baseadas em performance
- ✅ Tooltips explicativos
- ✅ Drill-down para detalhes

**Implementação**:
```tsx
const QuickStatsCards: React.FC<{ metrics: OverviewMetrics }> = ({ metrics }) => {
  const stats = [
    {
      title: 'Total de Pacientes',
      value: metrics.totalPatients,
      change: metrics.patientGrowthRate,
      icon: Users,
      color: 'blue',
      format: 'number'
    },
    {
      title: 'Consultas Este Mês',
      value: metrics.consultationsThisMonth,
      change: metrics.consultationGrowthRate,
      icon: Calendar,
      color: 'green',
      format: 'number'
    },
    {
      title: 'Tempo Médio de Transcrição',
      value: metrics.averageTranscriptionTime,
      change: -15, // melhoria de 15%
      icon: Clock,
      color: 'purple',
      format: 'duration'
    },
    {
      title: 'Uptime do Sistema',
      value: metrics.systemUptime,
      change: 0.1,
      icon: Activity,
      color: 'orange',
      format: 'percentage'
    }
  ];
  
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
          isLoading={!metrics}
          onClick={() => navigateToDetail(stat.title)}
        />
      ))}
    </div>
  );
};
```

### PatientGrowthChart.tsx
**Propósito**: Gráfico de crescimento de pacientes ao longo do tempo.

**Funcionalidades**:
- ✅ Gráfico de linha interativo
- ✅ Zoom e pan
- ✅ Múltiplas métricas (novos, total, taxa)
- ✅ Comparação com período anterior
- ✅ Export de imagem

**Tecnologias**:
- **Recharts**: Biblioteca principal de gráficos
- **D3.js**: Manipulações avançadas
- **Canvas**: Renderização de alta performance

```tsx
const PatientGrowthChart: React.FC<{ data: PatientGrowthData[] }> = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState<'newPatients' | 'totalPatients' | 'growthRate'>('newPatients');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  const processedData = useMemo(() => {
    return data
      .filter(item => isWithinTimeframe(item.date, timeframe))
      .map(item => ({
        ...item,
        date: formatDate(item.date, 'MMM dd'),
        previousPeriod: getPreviousPeriodData(item.date, data)
      }));
  }, [data, timeframe]);
  
  return (
    <Card className="chart-container">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3>Crescimento de Pacientes</h3>
          <div className="chart-controls">
            <MetricSelector 
              value={selectedMetric}
              onChange={setSelectedMetric}
              options={[
                { value: 'newPatients', label: 'Novos Pacientes' },
                { value: 'totalPatients', label: 'Total de Pacientes' },
                { value: 'growthRate', label: 'Taxa de Crescimento' }
              ]}
            />
            <TimeframeSelector 
              value={timeframe}
              onChange={setTimeframe}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              content={<CustomTooltip />}
              formatter={(value, name) => [formatValue(value, selectedMetric), name]}
            />
            <Legend />
            
            <Line 
              type="monotone" 
              dataKey={selectedMetric}
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            
            {/* Linha de comparação com período anterior */}
            <Line 
              type="monotone" 
              dataKey="previousPeriod"
              stroke="#94a3b8" 
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
```

### ConsultationTrendsChart.tsx
**Propósito**: Análise de tendências de consultas e transcrições.

**Funcionalidades**:
- ✅ Gráfico de barras combinado
- ✅ Correlação consultas vs transcrições
- ✅ Análise de duração média
- ✅ Identificação de padrões sazonais
- ✅ Previsões baseadas em tendências

```tsx
const ConsultationTrendsChart: React.FC<{ data: ConsultationTrendData[] }> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showPrediction, setShowPrediction] = useState(false);
  
  const aggregatedData = useMemo(() => {
    return aggregateDataByPeriod(data, viewMode);
  }, [data, viewMode]);
  
  const predictionData = useMemo(() => {
    if (!showPrediction) return [];
    return generatePredictions(aggregatedData, 7); // 7 períodos futuros
  }, [aggregatedData, showPrediction]);
  
  return (
    <Card className="chart-container">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3>Tendências de Consultas</h3>
          <div className="chart-controls">
            <ViewModeSelector value={viewMode} onChange={setViewMode} />
            <Switch 
              checked={showPrediction}
              onCheckedChange={setShowPrediction}
              label="Mostrar Previsões"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={[...aggregatedData, ...predictionData]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Barras de consultas */}
            <Bar 
              yAxisId="left"
              dataKey="consultations" 
              fill="#3b82f6" 
              name="Consultas"
              radius={[4, 4, 0, 0]}
            />
            
            {/* Barras de transcrições */}
            <Bar 
              yAxisId="left"
              dataKey="transcriptions" 
              fill="#10b981" 
              name="Transcrições"
              radius={[4, 4, 0, 0]}
            />
            
            {/* Linha de duração média */}
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="averageDuration" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Duração Média (min)"
            />
            
            {/* Área de previsão */}
            {showPrediction && (
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="predictedConsultations" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.2}
                strokeDasharray="5 5"
                name="Previsão"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
```

### RecentActivityFeed.tsx
**Propósito**: Feed de atividades recentes do sistema.

**Funcionalidades**:
- ✅ Timeline interativa
- ✅ Filtros por tipo de atividade
- ✅ Paginação infinita
- ✅ Ações rápidas (visualizar, editar)
- ✅ Notificações em tempo real

```tsx
const RecentActivityFeed: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => {
  const [filteredActivities, setFilteredActivities] = useState(activities);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const activityTypes = [
    { value: 'patient_created', label: 'Paciente Criado', icon: UserPlus, color: 'blue' },
    { value: 'consultation_completed', label: 'Consulta Concluída', icon: CheckCircle, color: 'green' },
    { value: 'transcription_finished', label: 'Transcrição Finalizada', icon: FileText, color: 'purple' },
    { value: 'report_generated', label: 'Relatório Gerado', icon: Download, color: 'orange' }
  ];
  
  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find(t => t.value === type);
    return activityType ? activityType.icon : Activity;
  };
  
  const getActivityColor = (type: string) => {
    const activityType = activityTypes.find(t => t.value === type);
    return activityType ? activityType.color : 'gray';
  };
  
  return (
    <Card className="activity-feed">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3>Atividades Recentes</h3>
          <div className="activity-controls">
            <ActivityTypeFilter 
              types={activityTypes}
              selected={selectedTypes}
              onChange={setSelectedTypes}
            />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Recolher' : 'Expandir'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className={`activity-list ${isExpanded ? 'expanded' : 'collapsed'}`}>
          {filteredActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            
            return (
              <div key={activity.id} className="activity-item">
                <div className="activity-timeline">
                  <div className={`activity-dot ${color}`}>
                    <Icon size={16} />
                  </div>
                  {index < filteredActivities.length - 1 && (
                    <div className="activity-line" />
                  )}
                </div>
                
                <div className="activity-content">
                  <div className="activity-header">
                    <h4>{activity.title}</h4>
                    <span className="activity-time">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="activity-description">
                    {activity.description}
                  </p>
                  
                  <div className="activity-meta">
                    <span className="activity-user">
                      Por {activity.userName}
                    </span>
                    
                    {activity.metadata && (
                      <div className="activity-actions">
                        {activity.metadata.patientId && (
                          <Button 
                            variant="ghost" 
                            size="xs"
                            onClick={() => navigateToPatient(activity.metadata.patientId)}
                          >
                            Ver Paciente
                          </Button>
                        )}
                        
                        {activity.metadata.consultationId && (
                          <Button 
                            variant="ghost" 
                            size="xs"
                            onClick={() => navigateToConsultation(activity.metadata.consultationId)}
                          >
                            Ver Consulta
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {!isExpanded && filteredActivities.length > 5 && (
          <div className="activity-footer">
            <Button 
              variant="ghost" 
              onClick={() => setIsExpanded(true)}
            >
              Ver mais {filteredActivities.length - 5} atividades
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

## Serviços e Integrações

### DashboardService
**Localização**: `src/services/dashboardService.ts`

**Funcionalidades Principais**:

```typescript
class DashboardService {
  private cache = new Map<string, CacheEntry>();
  private wsConnection: WebSocket | null = null;
  
  /**
   * Carrega dados completos do dashboard
   */
  async loadDashboardData(dateRange: DateRange, doctorId: string): Promise<DashboardData> {
    const cacheKey = `dashboard_${doctorId}_${dateRange.start}_${dateRange.end}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && !this.isCacheExpired(cached)) {
      return cached.data;
    }
    
    // Carregar dados em paralelo para melhor performance
    const [overview, chartData, activities, alerts] = await Promise.all([
      this.loadOverviewMetrics(dateRange, doctorId),
      this.loadChartData(dateRange, doctorId),
      this.loadRecentActivities(doctorId, 20),
      this.loadAlerts(doctorId)
    ]);
    
    const dashboardData: DashboardData = {
      overview,
      charts: chartData,
      recentActivity: activities,
      alerts,
      dateRange,
      lastUpdated: new Date()
    };
    
    // Cache por 5 minutos
    this.cache.set(cacheKey, {
      data: dashboardData,
      timestamp: Date.now(),
      ttl: 5 * 60 * 1000
    });
    
    return dashboardData;
  }
  
  /**
   * Carrega métricas de overview
   */
  private async loadOverviewMetrics(dateRange: DateRange, doctorId: string): Promise<OverviewMetrics> {
    const { data, error } = await supabase.rpc('get_dashboard_overview', {
      doctor_id: doctorId,
      start_date: dateRange.start.toISOString(),
      end_date: dateRange.end.toISOString()
    });
    
    if (error) throw error;
    
    return {
      totalPatients: data.total_patients || 0,
      newPatientsThisMonth: data.new_patients_this_month || 0,
      patientGrowthRate: data.patient_growth_rate || 0,
      totalConsultations: data.total_consultations || 0,
      consultationsThisMonth: data.consultations_this_month || 0,
      consultationGrowthRate: data.consultation_growth_rate || 0,
      totalTranscriptions: data.total_transcriptions || 0,
      transcriptionsThisMonth: data.transcriptions_this_month || 0,
      averageTranscriptionTime: data.avg_transcription_time || 0,
      systemUptime: data.system_uptime || 99.9,
      averageResponseTime: data.avg_response_time || 150,
      errorRate: data.error_rate || 0.1
    };
  }
  
  /**
   * Carrega dados para gráficos
   */
  private async loadChartData(dateRange: DateRange, doctorId: string): Promise<any> {
    const [patientGrowth, consultationTrends, performance] = await Promise.all([
      this.loadPatientGrowthData(dateRange, doctorId),
      this.loadConsultationTrendsData(dateRange, doctorId),
      this.loadPerformanceData(dateRange)
    ]);
    
    return {
      patientGrowth,
      consultationTrends,
      performance
    };
  }
  
  /**
   * Estabelece conexão WebSocket para atualizações em tempo real
   */
  connectRealTimeUpdates(doctorId: string, onUpdate: (data: Partial<DashboardData>) => void): void {
    if (this.wsConnection) {
      this.wsConnection.close();
    }
    
    const wsUrl = `${process.env.VITE_WS_URL}/dashboard/${doctorId}`;
    this.wsConnection = new WebSocket(wsUrl);
    
    this.wsConnection.onmessage = (event) => {
      const update = JSON.parse(event.data);
      onUpdate(update);
    };
    
    this.wsConnection.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Tentar reconectar após 5 segundos
      setTimeout(() => {
        this.connectRealTimeUpdates(doctorId, onUpdate);
      }, 5000);
    };
  }
  
  /**
   * Exporta dados do dashboard
   */
  async exportDashboard(data: DashboardData, format: 'pdf' | 'excel'): Promise<Blob> {
    if (format === 'pdf') {
      return this.exportToPDF(data);
    } else {
      return this.exportToExcel(data);
    }
  }
  
  private async exportToPDF(data: DashboardData): Promise<Blob> {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.text('Dashboard - Doctor Brief AI', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Período: ${formatDate(data.dateRange.start)} - ${formatDate(data.dateRange.end)}`, 20, 45);
    doc.text(`Gerado em: ${formatDate(data.lastUpdated)}`, 20, 55);
    
    // Métricas principais
    let yPosition = 75;
    doc.setFontSize(16);
    doc.text('Métricas Principais', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(12);
    const metrics = [
      `Total de Pacientes: ${data.overview.totalPatients}`,
      `Novos Pacientes (mês): ${data.overview.newPatientsThisMonth}`,
      `Total de Consultas: ${data.overview.totalConsultations}`,
      `Consultas (mês): ${data.overview.consultationsThisMonth}`,
      `Tempo Médio de Transcrição: ${data.overview.averageTranscriptionTime}s`,
      `Uptime do Sistema: ${data.overview.systemUptime}%`
    ];
    
    metrics.forEach(metric => {
      doc.text(metric, 25, yPosition);
      yPosition += 10;
    });
    
    // Adicionar gráficos como imagens (se disponível)
    // ...
    
    return new Blob([doc.output('blob')], { type: 'application/pdf' });
  }
  
  private async exportToExcel(data: DashboardData): Promise<Blob> {
    const XLSX = await import('xlsx');
    const workbook = XLSX.utils.book_new();
    
    // Planilha de métricas
    const metricsData = [
      ['Métrica', 'Valor'],
      ['Total de Pacientes', data.overview.totalPatients],
      ['Novos Pacientes (mês)', data.overview.newPatientsThisMonth],
      ['Taxa de Crescimento (%)', data.overview.patientGrowthRate],
      ['Total de Consultas', data.overview.totalConsultations],
      ['Consultas (mês)', data.overview.consultationsThisMonth],
      ['Taxa de Crescimento Consultas (%)', data.overview.consultationGrowthRate],
      ['Tempo Médio Transcrição (s)', data.overview.averageTranscriptionTime],
      ['Uptime Sistema (%)', data.overview.systemUptime],
      ['Tempo Resposta Médio (ms)', data.overview.averageResponseTime],
      ['Taxa de Erro (%)', data.overview.errorRate]
    ];
    
    const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
    XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Métricas');
    
    // Planilha de crescimento de pacientes
    if (data.charts.patientGrowth.length > 0) {
      const growthData = [
        ['Data', 'Novos Pacientes', 'Total Pacientes', 'Taxa Crescimento (%)'],
        ...data.charts.patientGrowth.map(item => [
          item.date,
          item.newPatients,
          item.totalPatients,
          item.growthRate
        ])
      ];
      
      const growthSheet = XLSX.utils.aoa_to_sheet(growthData);
      XLSX.utils.book_append_sheet(workbook, growthSheet, 'Crescimento Pacientes');
    }
    
    // Planilha de atividades recentes
    if (data.recentActivity.length > 0) {
      const activityData = [
        ['Data/Hora', 'Tipo', 'Título', 'Descrição', 'Usuário'],
        ...data.recentActivity.map(activity => [
          formatDateTime(activity.timestamp),
          activity.type,
          activity.title,
          activity.description,
          activity.userName
        ])
      ];
      
      const activitySheet = XLSX.utils.aoa_to_sheet(activityData);
      XLSX.utils.book_append_sheet(workbook, activitySheet, 'Atividades Recentes');
    }
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}

export const dashboardService = new DashboardService();
```

### Integração com Supabase

#### Stored Procedures para Performance
```sql
-- Função para obter métricas de overview
CREATE OR REPLACE FUNCTION get_dashboard_overview(
  doctor_id UUID,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  total_patients INTEGER;
  new_patients_this_month INTEGER;
  total_consultations INTEGER;
  consultations_this_month INTEGER;
  total_transcriptions INTEGER;
  transcriptions_this_month INTEGER;
  avg_transcription_time NUMERIC;
BEGIN
  -- Total de pacientes
  SELECT COUNT(*) INTO total_patients
  FROM patients 
  WHERE created_by = doctor_id
    AND created_at <= end_date;
  
  -- Novos pacientes no período
  SELECT COUNT(*) INTO new_patients_this_month
  FROM patients 
  WHERE created_by = doctor_id
    AND created_at BETWEEN start_date AND end_date;
  
  -- Total de consultas
  SELECT COUNT(*) INTO total_consultations
  FROM consultations 
  WHERE doctor_id = doctor_id
    AND created_at <= end_date;
  
  -- Consultas no período
  SELECT COUNT(*) INTO consultations_this_month
  FROM consultations 
  WHERE doctor_id = doctor_id
    AND created_at BETWEEN start_date AND end_date;
  
  -- Total de transcrições
  SELECT COUNT(*) INTO total_transcriptions
  FROM transcriptions t
  JOIN consultations c ON t.consultation_id = c.id
  WHERE c.doctor_id = doctor_id
    AND t.created_at <= end_date;
  
  -- Transcrições no período
  SELECT COUNT(*) INTO transcriptions_this_month
  FROM transcriptions t
  JOIN consultations c ON t.consultation_id = c.id
  WHERE c.doctor_id = doctor_id
    AND t.created_at BETWEEN start_date AND end_date;
  
  -- Tempo médio de transcrição
  SELECT AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) INTO avg_transcription_time
  FROM transcriptions t
  JOIN consultations c ON t.consultation_id = c.id
  WHERE c.doctor_id = doctor_id
    AND t.status = 'completed'
    AND t.created_at BETWEEN start_date AND end_date;
  
  -- Montar resultado JSON
  result := json_build_object(
    'total_patients', COALESCE(total_patients, 0),
    'new_patients_this_month', COALESCE(new_patients_this_month, 0),
    'patient_growth_rate', CASE 
      WHEN total_patients > 0 THEN 
        ROUND((new_patients_this_month::NUMERIC / total_patients * 100), 2)
      ELSE 0 
    END,
    'total_consultations', COALESCE(total_consultations, 0),
    'consultations_this_month', COALESCE(consultations_this_month, 0),
    'consultation_growth_rate', CASE 
      WHEN total_consultations > 0 THEN 
        ROUND((consultations_this_month::NUMERIC / total_consultations * 100), 2)
      ELSE 0 
    END,
    'total_transcriptions', COALESCE(total_transcriptions, 0),
    'transcriptions_this_month', COALESCE(transcriptions_this_month, 0),
    'avg_transcription_time', COALESCE(avg_transcription_time, 0),
    'system_uptime', 99.9, -- Valor mockado, integrar com monitoramento real
    'avg_response_time', 150, -- Valor mockado
    'error_rate', 0.1 -- Valor mockado
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para dados de crescimento de pacientes
CREATE OR REPLACE FUNCTION get_patient_growth_data(
  doctor_id UUID,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE(
  date DATE,
  new_patients INTEGER,
  total_patients INTEGER,
  growth_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH daily_stats AS (
    SELECT 
      DATE(created_at) as stat_date,
      COUNT(*) as daily_new
    FROM patients 
    WHERE created_by = doctor_id
      AND created_at BETWEEN start_date AND end_date
    GROUP BY DATE(created_at)
    ORDER BY stat_date
  ),
  cumulative_stats AS (
    SELECT 
      stat_date,
      daily_new,
      SUM(daily_new) OVER (ORDER BY stat_date) as cumulative_total
    FROM daily_stats
  )
  SELECT 
    cs.stat_date::DATE,
    cs.daily_new::INTEGER,
    cs.cumulative_total::INTEGER,
    CASE 
      WHEN LAG(cs.cumulative_total) OVER (ORDER BY cs.stat_date) > 0 THEN
        ROUND(
          ((cs.cumulative_total - LAG(cs.cumulative_total) OVER (ORDER BY cs.stat_date))::NUMERIC / 
           LAG(cs.cumulative_total) OVER (ORDER BY cs.stat_date) * 100), 2
        )
      ELSE 0
    END as growth_rate
  FROM cumulative_stats cs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Performance e Otimização

### Estratégias de Cache
```typescript
// Cache inteligente com invalidação automática
class DashboardCache {
  private cache = new Map<string, CacheEntry>();
  private subscribers = new Map<string, Set<Function>>();
  
  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  // Invalidar cache quando dados relacionados mudam
  invalidatePattern(pattern: string): void {
    const keysToDelete = Array.from(this.cache.keys())
      .filter(key => key.includes(pattern));
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.notifySubscribers(key);
    });
  }
  
  // Sistema de notificação para componentes
  subscribe(key: string, callback: Function): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    
    this.subscribers.get(key)!.add(callback);
    
    return () => {
      this.subscribers.get(key)?.delete(callback);
    };
  }
  
  private notifySubscribers(key: string): void {
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
  }
}

export const dashboardCache = new DashboardCache();
```

### Lazy Loading de Componentes
```typescript
// Carregamento sob demanda de gráficos pesados
const LazyPatientGrowthChart = lazy(() => 
  import('./PatientGrowthChart').then(module => ({
    default: module.PatientGrowthChart
  }))
);

const LazyConsultationTrendsChart = lazy(() => 
  import('./ConsultationTrendsChart').then(module => ({
    default: module.ConsultationTrendsChart
  }))
);

// Componente com Suspense
const DashboardCharts: React.FC = () => {
  return (
    <div className="charts-container">
      <Suspense fallback={<ChartSkeleton />}>
        <LazyPatientGrowthChart />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <LazyConsultationTrendsChart />
      </Suspense>
    </div>
  );
};
```

### Virtualização para Listas Grandes
```typescript
import { FixedSizeList as List } from 'react-window';

const VirtualizedActivityFeed: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const activity = activities[index];
    
    return (
      <div style={style}>
        <ActivityItem activity={activity} />
      </div>
    );
  };
  
  return (
    <List
      height={400}
      itemCount={activities.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

## Configuração e Deploy

### Variáveis de Ambiente
```env
# Dashboard específico
VITE_DASHBOARD_REFRESH_INTERVAL=30000
VITE_DASHBOARD_CACHE_TTL=300000
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_WS_URL=wss://api.doctorbriefai.com

# Gráficos e visualizações
VITE_CHART_ANIMATION_DURATION=750
VITE_ENABLE_CHART_EXPORT=true
VITE_MAX_CHART_DATA_POINTS=1000

# Performance
VITE_ENABLE_DASHBOARD_CACHE=true
VITE_PRELOAD_CHART_DATA=true
VITE_VIRTUALIZE_LARGE_LISTS=true
```

## Uso Prático

### Exemplo: Dashboard Completo
```tsx
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { useDashboard } from './hooks/useDashboard';

function DashboardPage() {
  const { 
    dashboardData, 
    loading, 
    error, 
    refreshData, 
    exportDashboard,
    dateRange,
    setDateRange
  } = useDashboard();
  
  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorMessage error={error} onRetry={refreshData} />;
  
  return (
    <div className="dashboard-page">
      <DashboardHeader 
        title="Dashboard"
        subtitle="Visão geral do seu consultório"
        actions={
          <div className="dashboard-actions">
            <DateRangePicker 
              value={dateRange}
              onChange={setDateRange}
            />
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={() => exportDashboard('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        }
      />
      
      <DashboardOverview data={dashboardData} />
    </div>
  );
}
```

## Testes

### Testes de Performance
```typescript
describe('Dashboard Performance', () => {
  test('should load dashboard data within 2 seconds', async () => {
    const startTime = Date.now();
    
    const data = await dashboardService.loadDashboardData(
      { start: new Date('2024-01-01'), end: new Date('2024-12-31') },
      'doctor-id'
    );
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    expect(data).toBeDefined();
    expect(data.overview).toBeDefined();
  });
  
  test('should cache dashboard data effectively', async () => {
    const dateRange = { start: new Date('2024-01-01'), end: new Date('2024-12-31') };
    const doctorId = 'doctor-id';
    
    // Primeira chamada
    const startTime1 = Date.now();
    await dashboardService.loadDashboardData(dateRange, doctorId);
    const loadTime1 = Date.now() - startTime1;
    
    // Segunda chamada (deve usar cache)
    const startTime2 = Date.now();
    await dashboardService.loadDashboardData(dateRange, doctorId);
    const loadTime2 = Date.now() - startTime2;
    
    expect(loadTime2).toBeLessThan(loadTime1 * 0.1); // 90% mais rápido
  });
});
```

## Roadmap

### Próximas Funcionalidades
- [ ] Dashboard personalizável (drag & drop)
- [ ] Alertas inteligentes com ML
- [ ] Comparação com benchmarks do setor
- [ ] Integração com Google Analytics
- [ ] Dashboard mobile nativo

### Melhorias Planejadas
- [ ] Gráficos 3D interativos
- [ ] Realidade aumentada para visualizações
- [ ] Integração com assistentes de voz
- [ ] Dashboard colaborativo em tempo real
- [ ] Análise preditiva avançada

## Contribuição

Para contribuir com este módulo:
1. **Performance**: Sempre considere impacto na performance
2. **Responsividade**: Teste em diferentes dispositivos
3. **Acessibilidade**: Implemente ARIA labels e navegação por teclado
4. **Testes**: Mantenha cobertura alta para componentes críticos
5. **Documentação**: Documente novos gráficos e métricas

## Suporte

Para problemas relacionados ao dashboard:
1. Verifique logs de performance no navegador
2. Confirme conectividade WebSocket
3. Valide cache e TTL configurados
4. Teste queries do Supabase diretamente
5. Monitore uso de memória em listas grandes

### Contatos Especializados
- **Performance**: performance@doctorbriefai.com
- **Visualizações**: charts@doctorbriefai.com
- **Real-time**: realtime@doctorbriefai.com