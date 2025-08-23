// Importações condicionais para evitar problemas no navegador
let McpServer: unknown = null;
let StdioServerTransport: unknown = null;
let CreateUiTool: unknown = null;
let FetchUiTool: unknown = null;
let RefineUiTool: unknown = null;
let LogoSearchTool: unknown = null;

// Função para carregamento dinâmico apenas no ambiente Node.js
async function loadMcpModules(): Promise<void> {
  if (typeof window === 'undefined') {
    try {
      const mcpModule = await import('@modelcontextprotocol/sdk/server/mcp.js');
      McpServer = mcpModule.McpServer;

      const stdioModule = await import('@modelcontextprotocol/sdk/server/stdio.js');
      StdioServerTransport = stdioModule.StdioServerTransport;

      const createUiModule = await import('../../magic-mcp/src/tools/create-ui.js');
      CreateUiTool = createUiModule.CreateUiTool;

      const fetchUiModule = await import('../../magic-mcp/src/tools/fetch-ui.js');
      FetchUiTool = fetchUiModule.FetchUiTool;

      const refineUiModule = await import('../../magic-mcp/src/tools/refine-ui.js');
      RefineUiTool = refineUiModule.RefineUiTool;

      const logoSearchModule = await import('../../magic-mcp/src/tools/logo-search.js');
      LogoSearchTool = logoSearchModule.LogoSearchTool;
    } catch (error) {
      console.warn(
        'Magic MCP tools not available in browser environment:',
        error
      );
    }
  }
}

/**
 * Interface para requisições de componentes médicos personalizados
 * @interface ComponentRequest
 */
interface ComponentRequest {
  /** Tipo do componente a ser gerado */
  type: 'form' | 'card' | 'table' | 'dialog' | 'dashboard' | 'chart';
  /** Descrição detalhada do componente desejado */
  description: string;
  /** Especialidade médica específica (opcional) */
  specialty?: string;
  /** Campos específicos para formulários (opcional) */
  fields?: string[];
  /** Mensagem personalizada para o gerador de IA (opcional) */
  message?: string;
}

/**
 * Interface para componentes gerados pelo Magic MCP
 * @interface GeneratedComponent
 */
interface GeneratedComponent {
  /** Código fonte do componente React/TypeScript */
  code: string;
  /** Nome do componente gerado */
  name: string;
  /** Descrição do componente */
  description: string;
  /** Lista de dependências necessárias */
  dependencies: string[];
}

/**
 * Serviço para integração com o Magic MCP (21st.dev)
 *
 * ⚠️ APENAS PARA USO EM DESENVOLVIMENTO ⚠️
 *
 * Este serviço permite gerar componentes médicos personalizados usando IA
 * durante o desenvolvimento, mas não está exposto na interface do usuário.
 *
 * Funcionalidades disponíveis para desenvolvedores:
 * - Geração de componentes React/TypeScript
 * - Busca de inspiração de componentes
 * - Refinamento de componentes existentes
 * - Biblioteca de logos médicos
 *
 * @class MagicMcpService
 * @author Trae AI
 * @version 1.0.0
 * @see https://21st.dev/magic
 * @example
 * ```typescript
 * const service = new MagicMcpService();
 * await service.initialize();
 * const component = await service.generateMedicalComponent(
 *   'Formulário de cadastro de paciente',
 *   'form'
 * );
 * ```
 */
export class MagicMcpService {
  private server: unknown = null;
  private apiKey: string;
  private createUiTool: unknown = null;
  private fetchUiTool: unknown = null;
  private refineUiTool: unknown = null;
  private logoSearchTool: unknown = null;
  private isAvailable: boolean = false;

  constructor() {
    this.apiKey =
      import.meta.env.VITE_TWENTYFIRST_API_KEY ||
      '2f1cd8f8-0b6b-4c88-8286-489f52f3ab9e';
    this.isAvailable = typeof window === 'undefined' && !!McpServer;

    if (this.isAvailable) {
      this.server = new McpServer({
        name: 'medassist-magic',
        version: '1.0.0',
      });

      // Inicializar os tools do Magic MCP
      this.createUiTool = new CreateUiTool();
      this.fetchUiTool = new FetchUiTool();
      this.refineUiTool = new RefineUiTool();
      this.logoSearchTool = new LogoSearchTool();
    } else {
      console.info(
        'Magic MCP rodando em modo de demonstração (browser environment)'
      );
    }
  }

  /**
   * Inicializa o serviço Magic MCP
   *
   * @async
   * @method initialize
   * @returns {Promise<void>} Promise que resolve quando o serviço está inicializado
   * @throws {Error} Quando a API Key não está configurada
   * @example
   * ```typescript
   * const service = new MagicMcpService();
   * await service.initialize();
   * ```
   */
  async initialize(): Promise<void> {
    // Carrega os módulos MCP dinamicamente
    await loadMcpModules();
    
    if (!this.isAvailable) {
      console.info('Magic MCP inicializado em modo de demonstração');
      return;
    }

    if (!this.apiKey) {
      throw new Error(
        'API Key do 21st.dev não configurada. Configure TWENTYFIRST_API_KEY no arquivo .env'
      );
    }

    console.log('Magic MCP Service inicializado com sucesso');
  }

  /**
   * Gera um componente médico usando IA
   *
   * @async
   * @method generateMedicalComponent
   * @param {string} description - Descrição detalhada do componente desejado
   * @param {('form'|'card'|'table'|'dialog'|'dashboard'|'chart')} [componentType='card'] - Tipo do componente a ser gerado
   * @returns {Promise<string>} Promise que resolve com o código do componente gerado
   * @example
   * ```typescript
   * const code = await service.generateMedicalComponent(
   *   'Formulário para cadastro de pacientes com campos básicos',
   *   'form'
   * );
   * console.log(code); // Código React/TypeScript do componente
   * ```
   */
  async generateMedicalComponent(
    description: string,
    componentType:
      | 'form'
      | 'card'
      | 'table'
      | 'dialog'
      | 'dashboard'
      | 'chart' = 'card'
  ): Promise<string> {
    // Estratégia de fallback: se o Magic MCP não estiver disponível,
    // usa templates locais para manter a funcionalidade
    if (!this.isAvailable || !this.createUiTool) {
      console.info('Usando template de demonstração para componente médico');
      return this.getMedicalComponentTemplate(description, componentType);
    }

    try {
      // Executa o CreateUiTool do Magic MCP com parâmetros otimizados
      // para geração de componentes médicos específicos
      const result = await this.createUiTool.execute({
        message: `Criar um ${componentType} médico: ${description}`,
        searchQuery: `medical ${componentType}`.trim(),
        absolutePathToCurrentFile: process.cwd() + '/src/components/generated',
        absolutePathToProjectDirectory: process.cwd(),
        componentQuery: `${componentType} médico com ${description}`,
      });

      // Retorna o código gerado pela IA ou fallback para template local
      return (
        result.content[0]?.text ||
        this.getMedicalComponentTemplate(description, componentType)
      );
    } catch (error) {
      console.error('Erro ao gerar componente médico:', error);
      // Sistema de fallback robusto: sempre retorna um componente funcional
      return this.getMedicalComponentTemplate(description, componentType);
    }
  }

  /**
   * Gera um componente médico usando o Magic MCP com configuração avançada
   *
   * @async
   * @method generateAdvancedMedicalComponent
   * @param {ComponentRequest} request - Configuração detalhada do componente
   * @returns {Promise<GeneratedComponent>} Promise que resolve com o componente completo gerado
   * @example
   * ```typescript
   * const component = await service.generateAdvancedMedicalComponent({
   *   type: 'form',
   *   description: 'Formulário de anamnese completo',
   *   specialty: 'cardiologia',
   *   fields: ['nome', 'idade', 'sintomas']
   * });
   * console.log(component.code, component.dependencies);
   * ```
   */
  async generateAdvancedMedicalComponent(
    request: ComponentRequest
  ): Promise<GeneratedComponent> {
    // Modo de demonstração: retorna templates pré-definidos quando
    // o Magic MCP não está disponível (ambiente de produção)
    if (!this.isAvailable || !this.createUiTool) {
      console.info(
        'Usando template de demonstração para componente médico avançado'
      );
      return {
        code: this.getMedicalComponentTemplate(
          request.description,
          request.type
        ),
        name: `Medical${request.type.charAt(0).toUpperCase() + request.type.slice(1)}`,
        description: request.description,
        dependencies: [
          '@radix-ui/react-dialog',
          '@radix-ui/react-form',
          'lucide-react',
        ],
      };
    }

    try {
      // Constrói uma mensagem contextualizada para o gerador de IA
      // incluindo especialidade médica e campos específicos quando fornecidos
      const result = await this.createUiTool.execute({
        message:
          request.message ||
          `Criar um ${request.type} médico para ${request.specialty || 'uso geral'}: ${request.description}`,
        searchQuery:
          `medical ${request.type} ${request.specialty || ''}`.trim(),
        absolutePathToCurrentFile: process.cwd() + '/src/components/generated',
        absolutePathToProjectDirectory: process.cwd(),
        componentQuery: `${request.type} médico com ${request.description}`,
      });

      // Estrutura o resultado com metadados completos do componente
      return {
        code: result.content[0]?.text || '',
        name: `Medical${request.type.charAt(0).toUpperCase() + request.type.slice(1)}`,
        description: request.description,
        dependencies: [
          '@radix-ui/react-dialog',
          '@radix-ui/react-form',
          'lucide-react',
        ],
      };
    } catch (error) {
      console.error('Erro ao gerar componente com Magic MCP:', error);
      // Sistema de recuperação: sempre retorna um componente funcional
      return {
        code: this.getMedicalComponentTemplate(
          request.description,
          request.type
        ),
        name: `Medical${request.type.charAt(0).toUpperCase() + request.type.slice(1)}`,
        description: request.description,
        dependencies: [
          '@radix-ui/react-dialog',
          '@radix-ui/react-form',
          'lucide-react',
        ],
      };
    }
  }

  /**
   * Busca inspiração de componentes usando o Magic MCP
   *
   * @async
   * @method fetchComponentInspiration
   * @param {string} searchQuery - Termo de busca para inspiração
   * @param {string} message - Mensagem contextual para a busca
   * @returns {Promise<string>} Promise que resolve com sugestões de componentes
   * @example
   * ```typescript
   * const inspiration = await service.fetchComponentInspiration(
   *   'medical dashboard',
   *   'Preciso de ideias para um painel médico'
   * );
   * ```
   */
  async fetchComponentInspiration(
    searchQuery: string,
    message: string
  ): Promise<string> {
    if (!this.isAvailable || !this.fetchUiTool) {
      console.info(
        'Fetch de inspiração não disponível em modo de demonstração'
      );
      return `Inspiração para: ${searchQuery}\n\nEm modo de demonstração, esta funcionalidade retornaria sugestões de componentes baseadas na busca.`;
    }

    try {
      const result = await this.fetchUiTool.execute({
        message,
        searchQuery,
      });
      return result.content[0]?.text || '';
    } catch (error) {
      console.error('Erro ao buscar inspiração de componente:', error);
      return '';
    }
  }

  /**
   * Refina um componente existente usando o Magic MCP
   *
   * @async
   * @method refineComponent
   * @param {string} filePath - Caminho para o arquivo do componente
   * @param {string} userMessage - Instruções de refinamento
   * @param {string} context - Contexto adicional para o refinamento
   * @returns {Promise<string>} Promise que resolve com o componente refinado
   * @example
   * ```typescript
   * const refined = await service.refineComponent(
   *   './src/components/PatientForm.tsx',
   *   'Adicionar validação de CPF',
   *   'Formulário de cadastro de pacientes'
   * );
   * ```
   */
  async refineComponent(
    filePath: string,
    userMessage: string,
    context: string
  ): Promise<string> {
    if (!this.isAvailable || !this.refineUiTool) {
      console.info(
        'Refinamento de componente não disponível em modo de demonstração'
      );
      return `Refinamento solicitado para: ${filePath}\n\nMensagem: ${userMessage}\n\nEm modo de demonstração, esta funcionalidade retornaria o componente refinado.`;
    }

    try {
      const result = await this.refineUiTool.execute({
        userMessage,
        absolutePathToRefiningFile: filePath,
        context,
      });
      return result.content[0]?.text || '';
    } catch (error) {
      console.error('Erro ao refinar componente:', error);
      return '';
    }
  }

  /**
   * Busca logos médicos usando o Magic MCP
   *
   * @async
   * @method searchMedicalLogos
   * @param {string[]} queries - Lista de termos para busca de logos
   * @param {('JSX'|'TSX'|'SVG')} [format='TSX'] - Formato de saída dos logos
   * @returns {Promise<string>} Promise que resolve com os componentes de logo
   * @example
   * ```typescript
   * const logos = await service.searchMedicalLogos(
   *   ['stethoscope', 'heart', 'medical cross'],
   *   'TSX'
   * );
   * ```
   */
  async searchMedicalLogos(
    queries: string[],
    format: 'JSX' | 'TSX' | 'SVG' = 'TSX'
  ): Promise<string> {
    if (!this.isAvailable || !this.logoSearchTool) {
      console.info('Busca de logos não disponível em modo de demonstração');
      return `// Logos médicos para: ${queries.join(', ')}\n// Formato: ${format}\n\n// Em modo de demonstração, esta funcionalidade retornaria componentes de logo em ${format}`;
    }

    try {
      const result = await this.logoSearchTool.execute({
        queries,
        format,
      });
      return result.content[0]?.text || '';
    } catch (error) {
      console.error('Erro ao buscar logos:', error);
      return '';
    }
  }

  /**
   * Gera templates de componentes médicos específicos
   *
   * @private
   * @method getMedicalComponentTemplate
   * @param {string} description - Descrição do componente
   * @param {('form'|'card'|'table'|'dialog'|'dashboard'|'chart')} componentType - Tipo do componente
   * @returns {string} Código template do componente
   */
  private getMedicalComponentTemplate(
    description: string,
    componentType: 'form' | 'card' | 'table' | 'dialog' | 'dashboard' | 'chart'
  ): string {
    const componentName = `Medical${componentType.charAt(0).toUpperCase() + componentType.slice(1)}`;

    const templates = {
      form: `import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ${componentName}() {
  const [formData, setFormData] = useState({});

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Formulário Médico</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="patient">Paciente</Label>
          <Input id="patient" placeholder="Nome do paciente" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diagnosis">Diagnóstico</Label>
          <Input id="diagnosis" placeholder="Diagnóstico preliminar" />
        </div>
        <Button className="w-full">Salvar</Button>
      </CardContent>
    </Card>
  );
}`,
      card: `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity } from 'lucide-react';

export function ${componentName}() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sinais Vitais</CardTitle>
        <Heart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Pressão Arterial</span>
            <Badge variant="outline">120/80 mmHg</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Frequência Cardíaca</span>
            <Badge variant="outline">72 bpm</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Temperatura</span>
            <Badge variant="outline">36.5°C</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}`,
      table: `import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ${componentName}() {
  const patients = [
    { id: 1, name: 'João Silva', age: 45, condition: 'Hipertensão' },
    { id: 2, name: 'Maria Santos', age: 32, condition: 'Diabetes' },
    { id: 3, name: 'Pedro Costa', age: 58, condition: 'Cardiopatia' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Pacientes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Condição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.condition}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}`,
      dialog: `import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ${componentName}() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Paciente</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Paciente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" placeholder="Digite o nome" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input id="cpf" placeholder="000.000.000-00" />
          </div>
          <Button onClick={() => setOpen(false)}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}`,
      dashboard: `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, Calendar, FileText, Activity } from 'lucide-react';

export function ${componentName}() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">+20.1% em relação ao mês anterior</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">+12% em relação a ontem</p>
        </CardContent>
      </Card>
    </div>
  );
}`,
      chart: `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ${componentName}() {
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Fev', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Abr', value: 800 },
    { name: 'Mai', value: 500 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico de Consultas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}`,
    };

    return templates[componentType] || templates.card;
  }

  /**
   * Template para formulários médicos personalizados
   *
   * @private
   * @method generateMedicalFormTemplate
   * @param {string} description - Descrição específica do formulário médico
   * @returns {string} Código template do formulário React com validação
   */
  private generateMedicalFormTemplate(description: string): string {
    return `
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MedicalFormData {
  // Defina os campos baseados na descrição: ${description}
}

export function MedicalForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<MedicalFormData>();

  const onSubmit = (data: MedicalFormData) => {
    console.log('Dados do formulário médico:', data);
    // Implementar lógica de salvamento
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Formulário Médico</CardTitle>
        <CardDescription>${description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Adicione campos específicos baseados na descrição */}
          <div className="space-y-2">
            <Label htmlFor="campo1">Campo Médico</Label>
            <Input
              id="campo1"
              {...register('campo1', { required: 'Campo obrigatório' })}
              placeholder="Digite aqui..."
            />
            {errors.campo1 && (
              <p className="text-sm text-red-600">{errors.campo1.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full">
            Salvar Dados Médicos
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
`;
  }

  /**
   * Template para cards médicos informativos
   *
   * @private
   * @method generateMedicalCardTemplate
   * @param {string} description - Descrição específica do card médico
   * @returns {string} Código template do card React com status e dados
   */
  private generateMedicalCardTemplate(description: string): string {
    return `
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MedicalCardProps {
  title: string;
  description?: string;
  status?: 'normal' | 'warning' | 'critical';
  data?: Record<string, any>;
}

export function MedicalCard({ title, description, status = 'normal', data }: MedicalCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge className={getStatusColor()}>
            {status.toUpperCase()}
          </Badge>
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">${description}</p>
          {data && (
            <div className="mt-4">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1">
                  <span className="font-medium">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm">
            Ver Detalhes
          </Button>
          <Button size="sm">
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
`;
  }

  /**
   * Template para tabelas médicas interativas
   *
   * @private
   * @method generateMedicalTableTemplate
   * @param {string} description - Descrição específica da tabela médica
   * @returns {string} Código template da tabela React com ações
   */
  private generateMedicalTableTemplate(description: string): string {
    return `
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MedicalTableData {
  id: string;
  // Defina colunas baseadas na descrição: ${description}
}

interface MedicalTableProps {
  data: MedicalTableData[];
  onRowClick?: (item: MedicalTableData) => void;
}

export function MedicalTable({ data, onRowClick }: MedicalTableProps) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Tabela Médica</h3>
        <p className="text-sm text-gray-600">${description}</p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Dados Médicos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow 
              key={item.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onRowClick?.(item)}
            >
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>Dados médicos específicos</TableCell>
              <TableCell>
                <Badge variant="outline">Normal</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
`;
  }

  /**
   * Template para diálogos médicos modais
   *
   * @private
   * @method generateMedicalDialogTemplate
   * @param {string} description - Descrição específica do diálogo médico
   * @returns {string} Código template do diálogo React com formulário
   */
  private generateMedicalDialogTemplate(description: string): string {
    return `
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { MedicalCallbackData } from '../types/common';

interface MedicalDialogProps {
  trigger?: React.ReactNode;
  onSave?: (data: MedicalCallbackData) => void;
}

export function MedicalDialog({ trigger, onSave }: MedicalDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleSave = () => {
    onSave?.(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Abrir Diálogo Médico</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Diálogo Médico</DialogTitle>
          <DialogDescription>
            ${description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="campo" className="text-right">
              Campo Médico
            </Label>
            <Input
              id="campo"
              className="col-span-3"
              onChange={(e) => setFormData({ ...formData, campo: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
`;
  }

  /**
   * Template para dashboards médicos com estatísticas
   *
   * @private
   * @method generateMedicalDashboardTemplate
   * @param {string} description - Descrição específica do dashboard médico
   * @returns {string} Código template do dashboard React com métricas
   */
  private generateMedicalDashboardTemplate(description: string): string {
    return `
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MedicalDashboardProps {
  stats?: Record<string, number>;
}

export function MedicalDashboard({ stats = {} }: MedicalDashboardProps) {
  const defaultStats = {
    'Pacientes Ativos': 150,
    'Consultas Hoje': 12,
    'Emergências': 3,
    'Taxa de Ocupação': 85,
    ...stats
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Médico</h2>
        <p className="text-gray-600">${description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(defaultStats).map(([key, value]) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {key}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <Badge variant="outline" className="mt-2">
                {key.includes('Emergências') ? 'Crítico' : 'Normal'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas atividades médicas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• Consulta com paciente João Silva</p>
              <p className="text-sm">• Exame de Maria Santos agendado</p>
              <p className="text-sm">• Relatório de Pedro Costa finalizado</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alertas Médicos</CardTitle>
            <CardDescription>Notificações importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Urgente</Badge>
                <span className="text-sm">Paciente em estado crítico</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Info</Badge>
                <span className="text-sm">Novo protocolo disponível</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
`;
  }

  /**
   * Template para gráficos médicos com visualização de dados
   *
   * @private
   * @method generateMedicalChartTemplate
   * @param {string} description - Descrição específica do gráfico médico
   * @returns {string} Código template do gráfico React com placeholder para bibliotecas
   */
  private generateMedicalChartTemplate(description: string): string {
    return `
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MedicalChartProps {
  title?: string;
  data?: any[];
}

export function MedicalChart({ title = 'Gráfico Médico', data = [] }: MedicalChartProps) {
  // Aqui você pode integrar com bibliotecas como Chart.js, Recharts, etc.
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>${description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Gráfico Médico</p>
            <p className="text-sm text-gray-400">
              Integre com Chart.js, Recharts ou outra biblioteca de gráficos
            </p>
          </div>
        </div>
        
        {/* Exemplo de dados tabulares enquanto não há gráfico */}
        {data.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Dados:</h4>
            <div className="space-y-1">
              {data.slice(0, 5).map((item, index) => (
                <div key={index} className="text-sm flex justify-between">
                  <span>Item {index + 1}:</span>
                  <span>{JSON.stringify(item)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
`;
  }

  /**
   * Busca componentes médicos por categoria
   *
   * @async
   * @method searchMedicalComponents
   * @param {string} category - Categoria médica para busca
   * @returns {Promise<string[]>} Promise que resolve com lista de componentes da categoria
   * @example
   * ```typescript
   * const components = await service.searchMedicalComponents('prontuario');
   * // Retorna: ['Formulário de Anamnese', 'Histórico Médico', ...]
   * ```
   */
  async searchMedicalComponents(category: string): Promise<string[]> {
    const medicalCategories = {
      prontuario: [
        'Formulário de Anamnese',
        'Histórico Médico',
        'Exames Realizados',
      ],
      consulta: [
        'Agenda de Consultas',
        'Ficha de Consulta',
        'Prescrição Médica',
      ],
      paciente: [
        'Cadastro de Paciente',
        'Perfil do Paciente',
        'Histórico de Consultas',
      ],
      relatorio: ['Relatório de Consulta', 'Laudo Médico', 'Receituário'],
      dashboard: [
        'Painel de Controle',
        'Estatísticas Médicas',
        'Alertas de Saúde',
      ],
    };

    return medicalCategories[category as keyof typeof medicalCategories] || [];
  }
}

/**
 * Instância singleton do serviço Magic MCP para uso global
 *
 * @constant {MagicMcpService} magicMcpService
 * @example
 * ```typescript
 * import { magicMcpService } from '@/services/magicMcpService';
 *
 * // Inicializar o serviço
 * await magicMcpService.initialize();
 *
 * // Gerar componente médico
 * const component = await magicMcpService.generateMedicalComponent(
 *   'Formulário de triagem médica',
 *   'form'
 * );
 * ```
 */
export const magicMcpService = new MagicMcpService();
