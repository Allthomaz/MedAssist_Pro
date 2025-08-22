import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Database, 
  FileText, 
  Mic, 
  HardDrive,
  TestTube,
  ArrowRight,
  CheckCircle,
  Settings
} from 'lucide-react';

interface TestRoute {
  path: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'auth' | 'database' | 'features' | 'storage';
  status: 'completed' | 'in-progress' | 'pending';
  requiresAuth?: boolean;
}

const TestNavigation: React.FC = () => {
  const location = useLocation();

  const testRoutes: TestRoute[] = [
    {
      path: '/test-auth',
      title: 'Teste de Autenticação',
      description: 'Teste completo do sistema de autenticação, criação de usuários e login/logout',
      icon: <Users className="h-5 w-5" />,
      category: 'auth',
      status: 'completed',
      requiresAuth: false
    },
    {
      path: '/test-rls',
      title: 'Teste de RLS (Row Level Security)',
      description: 'Verificação das políticas de segurança do banco de dados baseadas no tipo de usuário',
      icon: <Shield className="h-5 w-5" />,
      category: 'database',
      status: 'in-progress',
      requiresAuth: true
    },
    {
      path: '/test-database',
      title: 'Teste de Banco de Dados',
      description: 'Verificação das tabelas, relacionamentos e integridade dos dados',
      icon: <Database className="h-5 w-5" />,
      category: 'database',
      status: 'completed',
      requiresAuth: true
    },
    {
      path: '/test-audio',
      title: 'Teste de Áudio',
      description: 'Teste de gravação, transcrição e processamento de áudio médico',
      icon: <Mic className="h-5 w-5" />,
      category: 'features',
      status: 'completed',
      requiresAuth: true
    },
    {
      path: '/test-reports',
      title: 'Teste de Relatórios',
      description: 'Geração de relatórios médicos em PDF e outros formatos',
      icon: <FileText className="h-5 w-5" />,
      category: 'features',
      status: 'completed',
      requiresAuth: true
    },
    {
      path: '/test-storage',
      title: 'Teste de Storage',
      description: 'Teste de upload, download e gerenciamento de arquivos no Supabase Storage',
      icon: <HardDrive className="h-5 w-5" />,
      category: 'storage',
      status: 'completed',
      requiresAuth: true
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <Users className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'features':
        return <Settings className="h-4 w-4" />;
      case 'storage':
        return <HardDrive className="h-4 w-4" />;
      default:
        return <TestTube className="h-4 w-4" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'auth':
        return 'Autenticação e Autorização';
      case 'database':
        return 'Banco de Dados e Segurança';
      case 'features':
        return 'Funcionalidades Principais';
      case 'storage':
        return 'Armazenamento de Arquivos';
      default:
        return 'Outros Testes';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-300">
            <Settings className="h-3 w-3 mr-1 animate-spin" />
            Em Progresso
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-gray-600">
            <TestTube className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      default:
        return null;
    }
  };

  const groupedRoutes = testRoutes.reduce((acc, route) => {
    if (!acc[route.category]) {
      acc[route.category] = [];
    }
    acc[route.category].push(route);
    return acc;
  }, {} as Record<string, TestRoute[]>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <TestTube className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Centro de Testes - Sistema Médico</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Navegação de Testes</CardTitle>
          <CardDescription>
            Acesse os diferentes módulos de teste do sistema. Alguns testes requerem autenticação prévia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedRoutes).map(([category, routes]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  {getCategoryIcon(category)}
                  <h3 className="text-lg font-semibold">{getCategoryTitle(category)}</h3>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {routes.map((route) => {
                    const isCurrentPage = location.pathname === route.path;
                    
                    return (
                      <Card 
                        key={route.path} 
                        className={`transition-all hover:shadow-md ${
                          isCurrentPage ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {route.icon}
                              <CardTitle className="text-base">{route.title}</CardTitle>
                            </div>
                            {getStatusBadge(route.status)}
                          </div>
                          <CardDescription className="text-sm">
                            {route.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {route.requiresAuth && (
                                <Badge variant="outline" className="text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Requer Login
                                </Badge>
                              )}
                            </div>
                            
                            {isCurrentPage ? (
                              <Badge variant="default" className="text-xs">
                                Página Atual
                              </Badge>
                            ) : (
                              <Button asChild size="sm" variant="outline">
                                <Link to={route.path} className="flex items-center gap-1">
                                  Acessar
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informações adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informações dos Testes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Testes de Autenticação</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Criação de usuários médicos e pacientes</li>
                <li>• Validação de login e logout</li>
                <li>• Verificação de sessões e tokens</li>
                <li>• Teste de recuperação de senha</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Testes de Segurança</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Políticas RLS (Row Level Security)</li>
                <li>• Controle de acesso por tipo de usuário</li>
                <li>• Validação de permissões de dados</li>
                <li>• Auditoria de operações sensíveis</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Testes Funcionais</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gravação e transcrição de áudio</li>
                <li>• Geração de relatórios médicos</li>
                <li>• Upload e download de arquivos</li>
                <li>• Integração com APIs externas</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Testes de Banco</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Integridade referencial</li>
                <li>• Validação de constraints</li>
                <li>• Performance de queries</li>
                <li>• Backup e restore</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestNavigation;