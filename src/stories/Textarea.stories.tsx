import { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Textarea para entrada de texto multilinha no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Texto de placeholder',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado desabilitado',
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Número de linhas visíveis',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// Textarea básico
export const Default: Story = {
  args: {
    placeholder: 'Digite sua mensagem aqui...',
  },
};

// Textarea com label
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-md items-center gap-1.5">
      <Label htmlFor="message">Mensagem</Label>
      <Textarea id="message" placeholder="Digite sua mensagem aqui..." />
    </div>
  ),
};

// Textarea para observações médicas
export const MedicalObservations: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-2">
      <Label className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-medical-blue" />
        Observações Médicas
      </Label>
      <Textarea
        placeholder="Descreva os sintomas, histórico médico, observações do exame físico, diagnóstico preliminar e recomendações..."
        rows={6}
        className="resize-none"
      />
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Máximo 2000 caracteres</span>
        <span>0/2000</span>
      </div>
    </div>
  ),
};

// Textarea para prescrição médica
export const MedicalPrescription: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-2">
      <Label className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-medical-blue" />
        Prescrição Médica
        <Badge variant="outline" className="text-xs">
          Obrigatório
        </Badge>
      </Label>
      <Textarea
        placeholder={
          'Exemplo:\n\n1. Dipirona 500mg\n   - Tomar 1 comprimido a cada 6 horas\n   - Em caso de dor ou febre\n   - Por 5 dias\n\n2. Omeprazol 20mg\n   - Tomar 1 cápsula pela manhã\n   - Em jejum\n   - Por 30 dias'
        }
        rows={8}
        className="font-mono text-sm"
      />
      <div className="flex items-center gap-2 text-sm text-amber-600">
        <AlertCircle className="h-4 w-4" />
        <span>Verifique dosagens e interações medicamentosas</span>
      </div>
    </div>
  ),
};

// Textarea para anamnese
export const Anamnesis: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-medical-blue" />
          Queixa Principal
        </Label>
        <Textarea
          placeholder="Descreva a queixa principal do paciente..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>História da Doença Atual (HDA)</Label>
        <Textarea
          placeholder="Descreva o histórico da doença atual, início dos sintomas, evolução, fatores de melhora/piora..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>História Médica Pregressa</Label>
        <Textarea
          placeholder="Doenças anteriores, cirurgias, internações, alergias medicamentosas..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>História Familiar</Label>
        <Textarea
          placeholder="Histórico de doenças na família (diabetes, hipertensão, câncer, etc.)..."
          rows={2}
        />
      </div>
    </div>
  ),
};

// Textarea com contador de caracteres
export const WithCharacterCount: Story = {
  render: () => {
    const [text, setText] = useState('');
    const maxLength = 500;
    const remaining = maxLength - text.length;

    return (
      <div className="w-full max-w-md space-y-2">
        <Label>Comentários Adicionais</Label>
        <Textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Adicione comentários relevantes..."
          maxLength={maxLength}
          rows={4}
        />
        <div className="flex justify-between items-center text-sm">
          <span
            className={
              remaining < 50 ? 'text-red-500' : 'text-muted-foreground'
            }
          >
            {remaining} caracteres restantes
          </span>
          <span className="text-muted-foreground">
            {text.length}/{maxLength}
          </span>
        </div>
      </div>
    );
  },
};

// Textarea com estados de validação
export const ValidationStates: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-6">
      {/* Estado normal */}
      <div className="space-y-2">
        <Label>Estado Normal</Label>
        <Textarea placeholder="Digite aqui..." rows={3} />
      </div>

      {/* Estado de erro */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Diagnóstico
          <AlertCircle className="h-4 w-4 text-red-500" />
        </Label>
        <Textarea
          placeholder="Campo obrigatório"
          rows={3}
          className="border-red-500 focus:border-red-500 focus:ring-red-500"
        />
        <p className="text-sm text-red-500">Este campo é obrigatório</p>
      </div>

      {/* Estado de sucesso */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Tratamento Recomendado
          <CheckCircle className="h-4 w-4 text-green-500" />
        </Label>
        <Textarea
          value="Repouso por 7 dias e medicação conforme prescrição."
          rows={3}
          className="border-green-500 focus:border-green-500 focus:ring-green-500"
          readOnly
        />
        <p className="text-sm text-green-500">Informação salva com sucesso</p>
      </div>
    </div>
  ),
};

// Textarea desabilitado
export const Disabled: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <Label>Relatório Final (Somente Leitura)</Label>
      <Textarea
        value="Este relatório foi finalizado e não pode mais ser editado. Para alterações, entre em contato com o administrador."
        disabled
        rows={4}
      />
    </div>
  ),
};

// Textarea redimensionável
export const Resizable: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <Label>Observações (Redimensionável)</Label>
      <Textarea
        placeholder="Este campo pode ser redimensionado verticalmente..."
        rows={3}
        className="resize-y min-h-[80px] max-h-[300px]"
      />
      <p className="text-sm text-muted-foreground">
        Arraste o canto inferior direito para redimensionar
      </p>
    </div>
  ),
};

// Textarea para relatório médico
export const MedicalReport: Story = {
  render: () => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 2000);
    };

    return (
      <div className="w-full max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5 text-medical-blue" />
            Relatório Médico Completo
          </Label>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Última edição: há 5 min
            </Badge>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              variant="medical"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        <Textarea
          placeholder={
            'RELATÓRIO MÉDICO\n\nPaciente: [Nome do paciente]\nData: [Data da consulta]\nMédico: [Nome do médico]\n\n1. IDENTIFICAÇÃO\n   - Nome:\n   - Idade:\n   - Sexo:\n   - Profissão:\n\n2. QUEIXA PRINCIPAL\n   [Descrever a queixa principal]\n\n3. HISTÓRIA DA DOENÇA ATUAL\n   [Detalhar o histórico]\n\n4. EXAME FÍSICO\n   [Resultados do exame]\n\n5. HIPÓTESE DIAGNÓSTICA\n   [Diagnóstico preliminar]\n\n6. CONDUTA\n   [Tratamento recomendado]\n\n7. OBSERVAÇÕES\n   [Observações adicionais]'
          }
          rows={20}
          className="font-mono text-sm leading-relaxed"
        />

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Documento médico oficial</span>
          <span>Salvo automaticamente a cada 30 segundos</span>
        </div>
      </div>
    );
  },
};

// Textarea com diferentes tamanhos
export const Sizes: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <Label>Pequeno (2 linhas)</Label>
        <Textarea placeholder="Observação rápida..." rows={2} />
      </div>

      <div className="space-y-2">
        <Label>Médio (4 linhas)</Label>
        <Textarea placeholder="Descrição detalhada..." rows={4} />
      </div>

      <div className="space-y-2">
        <Label>Grande (8 linhas)</Label>
        <Textarea placeholder="Relatório completo..." rows={8} />
      </div>
    </div>
  ),
};
