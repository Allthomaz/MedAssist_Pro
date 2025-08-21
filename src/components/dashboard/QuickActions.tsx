import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Video, Users, ClipboardList, FileText, Plus } from 'lucide-react';

const quickActions = [
  {
    title: 'Nova Consulta',
    description: 'Iniciar consulta com gravação',
    icon: Video,
    action: 'start-consultation',
    variant: 'medical-outline' as const,
    priority: true,
  },
  {
    title: 'Novo Paciente',
    description: 'Cadastrar novo paciente',
    icon: Users,
    action: 'new-patient',
    variant: 'medical-outline' as const,
    priority: false,
  },
  {
    title: 'Criar Modelo',
    description: 'Modelo de prontuário com IA',
    icon: ClipboardList,
    action: 'create-template',
    variant: 'medical-outline' as const,
    priority: false,
  },
  {
    title: 'Documentos',
    description: 'Visualizar documentos recentes',
    icon: FileText,
    action: 'view-documents',
    variant: 'medical-outline' as const,
    priority: false,
  },
];

export function QuickActions() {
  const navigate = useNavigate();
  
  const handleAction = (action: string) => {
    switch (action) {
      case 'start-consultation':
        // TODO: Implement consultation start
        console.log('Starting consultation...');
        break;
      case 'new-patient':
        navigate('/patients');
        break;
      case 'create-template':
        navigate('/templates');
        break;
      case 'view-documents':
        navigate('/documents');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <Card className="premium-stats-card premium-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Plus className="w-5 h-5 text-primary" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.action}
              variant={action.variant}
              className={`premium-button-outline w-full justify-start gap-3 h-auto p-4 ${
                action.priority ? 'ring-2 ring-primary/20' : ''
              }`}
              onClick={() => handleAction(action.action)}
            >
              <div className="icon-container flex items-center justify-center w-8 h-8">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left flex-1">
                <div className="font-medium text-foreground">{action.title}</div>
                <div className="text-sm text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}