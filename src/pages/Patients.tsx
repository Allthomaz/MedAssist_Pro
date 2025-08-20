import React, { useState } from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PatientForm } from '@/components/patients/PatientForm';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin,
  MoreVertical,
  Filter
} from 'lucide-react';

const patients = [
  {
    id: 1,
    name: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    phone: '(11) 99999-9999',
    age: 34,
    lastVisit: '2024-01-15',
    status: 'active',
    consultations: 12,
    nextAppointment: '2024-01-22',
  },
  {
    id: 2,
    name: 'João Carlos Oliveira',
    email: 'joao.oliveira@email.com',
    phone: '(11) 88888-8888',
    age: 45,
    lastVisit: '2024-01-10',
    status: 'active',
    consultations: 8,
    nextAppointment: null,
  },
  {
    id: 3,
    name: 'Ana Costa Lima',
    email: 'ana.costa@email.com',
    phone: '(11) 77777-7777',
    age: 28,
    lastVisit: '2024-01-08',
    status: 'pending',
    consultations: 3,
    nextAppointment: '2024-01-20',
  },
];

const Patients = () => {
  const [showPatientForm, setShowPatientForm] = useState(false);

  if (showPatientForm) {
    return (
      <MedicalLayout>
        <PatientForm
          onSuccess={() => {
            setShowPatientForm(false);
            // Aqui você pode adicionar lógica para recarregar a lista de pacientes
          }}
          onCancel={() => setShowPatientForm(false)}
        />
      </MedicalLayout>
    );
  }

  return (
    <MedicalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
            <p className="text-muted-foreground">
              Gerencie o cadastro e histórico dos seus pacientes
            </p>
          </div>
          <Button 
            variant="medical" 
            className="gap-2"
            onClick={() => setShowPatientForm(true)}
          >
            <Plus className="w-4 h-4" />
            Novo Paciente
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar pacientes por nome, email ou telefone..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <div className="grid gap-4">
          {patients.map((patient) => (
            <Card key={patient.id} className="medical-card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-medical-blue/10 text-medical-blue">
                        {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">{patient.age} anos</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Última consulta: {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="outline" 
                          className={patient.status === 'active' 
                            ? 'bg-medical-success/10 text-medical-success border-medical-success/20' 
                            : 'bg-orange-100 text-orange-700 border-orange-200'
                          }
                        >
                          {patient.status === 'active' ? 'Ativo' : 'Pendente'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {patient.consultations} consultas
                        </span>
                        {patient.nextAppointment && (
                          <span className="text-sm text-medical-blue">
                            Próxima: {new Date(patient.nextAppointment).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="medical-outline" size="sm">
                      Nova Consulta
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
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
                <Plus className="w-5 h-5 text-medical-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Funcionalidade Completa</h3>
                <p className="text-sm text-muted-foreground">
                  Para cadastrar novos pacientes e gerenciar dados reais, conecte ao Supabase para ativar o banco de dados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MedicalLayout>
  );
};

export default Patients;