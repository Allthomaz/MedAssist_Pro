import React, { useState, useEffect } from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Video, FileText, Clock, TrendingUp, Plus, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Database } from '@/types/database.types';
import { useThemePreferences } from '@/hooks/useThemePreferences';

type Patient = Database['public']['Tables']['patients']['Row'];

const Index = () => {
  const { fullDisplayName, professionName } = useProfile();
  const { user, profile } = useAuth();
  const { compactMode } = useThemePreferences();
  const navigate = useNavigate();
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalConsultations: 0,
    totalTranscriptions: 0
  });

  // Load dashboard data
  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Load recent patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (patientsError) {
        console.error('Erro ao carregar pacientes:', patientsError);
      } else {
        setRecentPatients(patientsData || []);
      }
      
      // Load stats
      const { count: patientsCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user.id);
      
      const { count: consultationsCount } = await supabase
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user.id);
      
      const { count: transcriptionsCount } = await supabase
        .from('transcriptions')
        .select('*, recordings!inner(doctor_id)', { count: 'exact', head: true })
        .eq('recordings.doctor_id', user.id);
      
      setStats({
        totalPatients: patientsCount || 0,
        totalConsultations: consultationsCount || 0,
        totalTranscriptions: transcriptionsCount || 0
      });
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);
  
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <MedicalLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 medical-header ${compactMode ? 'medical-spacing' : 'medical-spacing-lg'}`}>
          <div className="space-y-1">
            <h1 className={`font-bold text-foreground tracking-tight ${compactMode ? 'medical-text-2xl' : 'text-3xl'}`}>
              Dashboard
            </h1>
            <p className={`text-muted-foreground ${compactMode ? 'text-sm' : 'text-base'}`}>
              Bem-vindo de volta, {fullDisplayName}.
            </p>
            <p className={`text-muted-foreground ${compactMode ? 'text-xs' : 'text-sm'}`}>
              {professionName}
            </p>
            {profile?.custom_title && (
              <div className={`custom-title-highlight mt-2 ${compactMode ? 'medical-spacing' : ''}`}>
                <p className={`text-medical-blue font-medium ${compactMode ? 'text-xs' : 'text-sm'} flex items-center gap-2`}>
                  <Sparkles className="h-4 w-4" />
                  {profile.custom_title}
                </p>
              </div>
            )}
          </div>
          <Button className={`medical-gradient medical-glow text-white shadow-lg hover:shadow-xl transition-all duration-200 w-fit ${compactMode ? 'medical-button' : ''}`}>
            Nova Consulta
          </Button>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${compactMode ? 'medical-spacing' : ''}`}>
          <div className={compactMode ? 'medical-stats-card' : ''}>
            <StatsCard
              title="Total de Pacientes"
              value={loading ? "..." : stats.totalPatients.toString()}
              description="Pacientes cadastrados"
              icon={Users}
              trend={{ value: "+12%", isPositive: true }}
            />
          </div>
          <div className={compactMode ? 'medical-stats-card' : ''}>
            <StatsCard
              title="Consultas Realizadas"
              value={loading ? "..." : stats.totalConsultations.toString()}
              description="Consultas realizadas"
              icon={Video}
              trend={{ value: "+2", isPositive: true }}
            />
          </div>
          <div className={compactMode ? 'medical-stats-card' : ''}>
            <StatsCard
              title="Transcrições"
              value={loading ? "..." : stats.totalTranscriptions.toString()}
              description="Transcrições geradas"
              icon={FileText}
              trend={{ value: "-1", isPositive: false }}
            />
          </div>
          <div className={compactMode ? 'medical-stats-card' : ''}>
            <StatsCard
              title="Tempo Médio"
              value="12min"
              description="Por documento gerado"
              icon={Clock}
              trend={{ value: "-2min", isPositive: false }}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 items-start ${compactMode ? 'medical-spacing' : ''}`}>
          {/* Quick Actions */}
          <div className={`lg:col-span-2 ${compactMode ? 'medical-card' : ''}`}>
            <QuickActions />
          </div>

          {/* Recent Activity */}
          <div className={`lg:col-span-1 ${compactMode ? 'medical-card' : ''}`}>
            <RecentActivity />
          </div>
        </div>
        
        {/* Seção de Pacientes Recentes */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 ${compactMode ? 'medical-spacing' : ''}`}>
          <Card className={`medical-card medical-card-hover ${compactMode ? 'medical-card' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className={`font-semibold text-gray-900 ${compactMode ? 'text-base' : 'text-lg'}`}>
                Pacientes Recentes
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className={`gap-2 text-medical-blue hover:text-medical-teal hover:bg-medical-blue/10 ${compactMode ? 'medical-button' : ''}`}
                onClick={() => navigate('/patients')}
              >
                Ver Todos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : recentPatients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhum paciente cadastrado ainda</p>
                  <Button 
                    onClick={() => navigate('/patients')}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Cadastrar Primeiro Paciente
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div 
                      key={patient.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate('/patients')}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {patient.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {patient.full_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {patient.birth_date ? `${calculateAge(patient.birth_date)} anos` : 'Idade não informada'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Seção de Atividades Recentes */}
          <Card className={`medical-card medical-card-hover ${compactMode ? 'medical-card' : ''}`}>
            <CardHeader>
              <CardTitle className={`font-semibold text-gray-900 ${compactMode ? 'text-base' : 'text-lg'}`}>
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Sistema iniciado
                    </p>
                    <p className="text-xs text-gray-500">
                      Bem-vindo ao Doctor Brief AI
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MedicalLayout>
  );
};

export default Index;
