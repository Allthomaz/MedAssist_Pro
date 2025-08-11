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
    variant: 'medical' as const,
  },
  {
    title: 'Novo Paciente',
    description: 'Cadastrar novo paciente',
    icon: Users,
    action: 'new-patient',
    variant: 'medical-outline' as const,
  },
  {
    title: 'Criar Modelo',
    description: 'Modelo de prontuário com IA',
    icon: ClipboardList,
    action: 'create-template',
    variant: 'medical-outline' as const,
  },
  {
    title: 'Documentos',
    description: 'Visualizar documentos recentes',
    icon: FileText,
    action: 'view-documents',
    variant: 'medical-ghost' as const,
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
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <Button
            key={action.action}
            variant={action.variant}
            className="h-auto p-4 flex flex-col items-start gap-2"
            onClick={() => {
              // TODO: Implement navigation to different pages
              console.log(`Action: ${action.action}`);
            }}
          >
            <div className="flex items-center gap-2 w-full">
              <action.icon className="w-5 h-5" />
              <span className="font-medium">{action.title}</span>
            </div>
            <span className="text-xs opacity-80 text-left">{action.description}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}