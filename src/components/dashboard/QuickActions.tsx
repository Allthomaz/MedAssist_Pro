import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="w-5 h-5 text-medical-blue" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0">
        {quickActions.map((action) => (
          <Button
            key={action.action}
            variant={action.variant}
            className={`group h-auto p-4 flex flex-col items-start gap-2 text-left justify-start min-h-[90px] w-full transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${
              action.priority ? 'ring-2 ring-medical-blue/20 bg-medical-blue/5 border-medical-blue/30' : 'border-border/60'
            }`}
            onClick={() => {
              // TODO: Implement navigation to different pages
              console.log(`Action: ${action.action}`);
            }}
          >
            <div className="flex items-center gap-3 w-full">
              <div className={`p-2 rounded-lg ${
                action.priority ? 'bg-medical-blue/10' : 'bg-primary/10'
              }`}>
                <action.icon className={`w-4 h-4 ${
                  action.priority ? 'text-medical-blue' : 'text-primary'
                }`} />
              </div>
              <span className={`font-semibold text-sm leading-tight flex-1 ${
                action.priority ? 'text-medical-blue' : 'text-foreground'
              }`}>{action.title}</span>
            </div>
            <span className="text-xs text-muted-foreground leading-relaxed w-full pl-12">{action.description}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}