import React from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Video, 
  Clock, 
  User, 
  Calendar,
  Play,
  Pause,
  Square,
  Mic,
  MicOff,
  VideoOff,
  Settings,
  FileText,
  Brain
} from 'lucide-react';

const recentConsultations = [
  {
    id: 1,
    patient: 'Maria Silva Santos',
    date: '2024-01-15',
    time: '14:30',
    duration: '25 min',
    status: 'completed',
    documentGenerated: true,
    type: 'Consulta Geral',
  },
  {
    id: 2,
    patient: 'João Carlos Oliveira',
    date: '2024-01-15',
    time: '15:00',
    duration: '18 min',
    status: 'pending_review',
    documentGenerated: true,
    type: 'Retorno',
  },
  {
    id: 3,
    patient: 'Ana Costa Lima',
    date: '2024-01-14',
    time: '16:30',
    duration: '32 min',
    status: 'in_progress',
    documentGenerated: false,
    type: 'Primeira Consulta',
  },
];

const Consultations = () => {
  return (
    <MedicalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Consultas</h1>
            <p className="text-muted-foreground">
              Gerencie consultas com gravação e automação de documentos
            </p>
          </div>
          <Button variant="medical" className="gap-2">
            <Video className="w-4 h-4" />
            Nova Consulta
          </Button>
        </div>

        {/* Video Interface Demo */}
        <Card className="bg-gradient-to-r from-medical-blue/5 to-primary/5 border-medical-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-medical-blue" />
              Interface de Consulta Virtual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mock Video Area */}
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative">
              <div className="text-center text-white space-y-2">
                <VideoOff className="w-12 h-12 mx-auto opacity-50" />
                <p className="text-sm opacity-75">Área de vídeo da consulta</p>
              </div>
              
              {/* Recording Indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-medical-alert/90 text-white px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Gravando
              </div>
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="medical-ghost" size="sm">
                <Mic className="w-4 h-4" />
              </Button>
              <Button variant="medical-ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="medical-alert" size="lg" className="gap-2">
                <Square className="w-4 h-4" />
                Finalizar Consulta
              </Button>
              <Button variant="medical-ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            <div className="bg-card rounded-lg p-4 border">
              <h4 className="font-medium text-foreground mb-2">Fluxo de Automação</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-medical-success text-white flex items-center justify-center text-xs">1</div>
                  Gravação da consulta
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-medical-blue text-white flex items-center justify-center text-xs">2</div>
                  Transcrição automática
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-accent text-foreground flex items-center justify-center text-xs">3</div>
                  Geração do documento
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-medical-blue" />
              Consultas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentConsultations.map((consultation) => (
              <div key={consultation.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-medical-blue/10 text-medical-blue">
                      {consultation.patient.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-foreground">{consultation.patient}</h4>
                      <Badge variant="outline">{consultation.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(consultation.date).toLocaleDateString('pt-BR')} às {consultation.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {consultation.duration}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline"
                    className={
                      consultation.status === 'completed' 
                        ? 'bg-medical-success/10 text-medical-success border-medical-success/20'
                        : consultation.status === 'pending_review'
                        ? 'bg-orange-100 text-orange-700 border-orange-200'
                        : 'bg-medical-blue/10 text-medical-blue border-medical-blue/20'
                    }
                  >
                    {consultation.status === 'completed' && 'Concluída'}
                    {consultation.status === 'pending_review' && 'Aguardando Revisão'}
                    {consultation.status === 'in_progress' && 'Em Andamento'}
                  </Badge>
                  
                  {consultation.documentGenerated && (
                    <Button variant="medical-outline" size="sm" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Ver Documento
                    </Button>
                  )}
                  
                  {consultation.status === 'pending_review' && (
                    <Button variant="medical" size="sm" className="gap-2">
                      <Brain className="w-4 h-4" />
                      Revisar IA
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Integration Notice */}
        <Card className="bg-accent/50 border-medical-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-medical-blue/10">
                <Video className="w-5 h-5 text-medical-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Funcionalidades Avançadas</h3>
                <p className="text-sm text-muted-foreground">
                  Para ativar gravação de vídeo, transcrição automática e geração de documentos com IA, conecte ao Supabase e configure as integrações necessárias.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MedicalLayout>
  );
};

export default Consultations;