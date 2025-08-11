import React from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  ClipboardList, 
  Brain, 
  Edit3, 
  Copy, 
  Trash2,
  Sparkles,
  FileText
} from 'lucide-react';

const templates = [
  {
    id: 1,
    name: 'SOAP - Consulta Geral',
    description: 'Modelo estruturado para consultas de clínica geral',
    category: 'Clínica Geral',
    sections: ['Subjetivo', 'Objetivo', 'Avaliação', 'Plano'],
    usage: 45,
    lastUsed: '2024-01-15',
    aiGenerated: false,
  },
  {
    id: 2,
    name: 'Avaliação Pediátrica',
    description: 'Modelo específico para consultas pediátricas com marcos de desenvolvimento',
    category: 'Pediatria',
    sections: ['Anamnese', 'Exame Físico', 'Desenvolvimento', 'Orientações'],
    usage: 23,
    lastUsed: '2024-01-12',
    aiGenerated: true,
  },
  {
    id: 3,
    name: 'Consulta Cardiológica',
    description: 'Avaliação cardiovascular completa com exames específicos',
    category: 'Cardiologia',
    sections: ['História Cardiovascular', 'Exame Físico Cardiovascular', 'ECG', 'Conduta'],
    usage: 18,
    lastUsed: '2024-01-10',
    aiGenerated: true,
  },
  {
    id: 4,
    name: 'Retorno - Acompanhamento',
    description: 'Modelo simplificado para consultas de retorno',
    category: 'Geral',
    sections: ['Evolução', 'Exame', 'Ajustes', 'Próximos Passos'],
    usage: 67,
    lastUsed: '2024-01-14',
    aiGenerated: false,
  },
];

const Templates = () => {
  return (
    <MedicalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Modelos de Prontuário</h1>
            <p className="text-muted-foreground">
              Crie e gerencie modelos personalizados com auxílio da IA
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="medical-outline" className="gap-2">
              <Brain className="w-4 h-4" />
              Criar com IA
            </Button>
            <Button variant="medical" className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Modelo
            </Button>
          </div>
        </div>

        {/* AI Template Creator */}
        <Card className="bg-gradient-to-r from-medical-blue/5 to-primary/5 border-medical-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-medical-blue" />
              Gerador de Modelos com IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Descreva o tipo de prontuário que precisa e a IA criará um modelo estruturado para você.
            </p>
            <div className="flex gap-3">
              <Button variant="medical" className="gap-2">
                <Brain className="w-4 h-4" />
                Começar Criação
              </Button>
              <Button variant="medical-ghost">
                Ver Exemplos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="medical-card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-medical-blue" />
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.aiGenerated && (
                        <Badge variant="outline" className="bg-medical-blue/10 text-medical-blue border-medical-blue/20">
                          <Sparkles className="w-3 h-3 mr-1" />
                          IA
                        </Badge>
                      )}
                    </div>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-medical-alert hover:text-medical-alert">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{template.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Seções do modelo:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.sections.map((section, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {section}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Usado {template.usage} vezes</span>
                  <span>Último uso: {new Date(template.lastUsed).toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="medical" size="sm" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Usar Modelo
                  </Button>
                  <Button variant="medical-outline" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Supabase Connection Notice */}
        <Card className="bg-accent/50 border-medical-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-medical-blue/10">
                <Brain className="w-5 h-5 text-medical-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Integração com IA</h3>
                <p className="text-sm text-muted-foreground">
                  Para usar a geração de modelos com IA e salvar templates personalizados, conecte ao Supabase para ativar as funcionalidades completas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MedicalLayout>
  );
};

export default Templates;