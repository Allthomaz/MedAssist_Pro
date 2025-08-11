import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Video, Users } from 'lucide-react';

const recentActivities = [
  {
    id: 1,
    type: 'consultation',
    title: 'Consulta finalizada - Maria Silva',
    description: 'Documento gerado com sucesso',
    time: '2 min atrás',
    status: 'completed',
    icon: Video,
  },
  {
    id: 2,
    type: 'document',
    title: 'Prontuário aprovado - João Santos',
    description: 'Revisão médica concluída',
    time: '15 min atrás',
    status: 'approved',
    icon: FileText,
  },
  {
    id: 3,
    type: 'patient',
    title: 'Novo paciente cadastrado',
    description: 'Ana Costa adicionada ao sistema',
    time: '1h atrás',
    status: 'new',
    icon: Users,
  },
  {
    id: 4,
    type: 'consultation',
    title: 'Consulta agendada - Pedro Lima',
    description: 'Consulta marcada para hoje às 15:00',
    time: '2h atrás',
    status: 'scheduled',
    icon: Clock,
  },
];

export function RecentActivity() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-medical-success/10 text-medical-success border-medical-success/20';
      case 'approved':
        return 'bg-medical-blue/10 text-medical-blue border-medical-blue/20';
      case 'new':
        return 'bg-accent text-accent-foreground';
      case 'scheduled':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'approved':
        return 'Aprovado';
      case 'new':
        return 'Novo';
      case 'scheduled':
        return 'Agendado';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-medical-blue" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-medical-blue/10">
                <activity.icon className="w-4 h-4 text-medical-blue" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.time}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.description}
              </p>
              <div className="mt-2">
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(activity.status)} text-xs`}
                >
                  {getStatusText(activity.status)}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}