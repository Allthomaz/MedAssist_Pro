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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-medical-blue" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <Button
            key={action.action}
            variant={action.variant}
            className={`group h-auto p-4 flex flex-col items-start gap-3 text-left justify-start min-h-[80px] w-full transition-all duration-200 hover:scale-[1.02] ${
              action.priority ? 'ring-2 ring-medical-blue/20 bg-medical-blue/5' : ''
            }`}
            onClick={() => {
              // TODO: Implement navigation to different pages
              console.log(`Action: ${action.action}`);
            }}
          >
            <div className="flex items-center gap-3 w-full">
              <action.icon className={`w-5 h-5 flex-shrink-0 ${
                action.priority ? 'text-medical-blue group-hover:text-medical-blue-foreground' : ''
              }`} />
              <span className={`font-medium text-sm leading-tight ${
                action.priority ? 'text-medical-blue group-hover:text-medical-blue-foreground' : ''
              }`}>{action.title}</span>
            </div>
            <span className="text-xs opacity-75 text-left leading-relaxed w-full">{action.description}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}