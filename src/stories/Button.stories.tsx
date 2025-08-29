import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { Button } from '@/components/ui/button';
import { Activity, Heart, Plus, Save, Settings } from 'lucide-react';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Button com variantes médicas personalizadas para o MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'medical',
        'medical-success',
        'medical-alert',
        'medical-outline',
        'medical-ghost',
      ],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Stories básicas
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Medical: Story = {
  args: {
    variant: 'medical',
    children: 'Botão Médico',
  },
};

export const MedicalSuccess: Story = {
  args: {
    variant: 'medical-success',
    children: 'Sucesso',
  },
};

export const MedicalAlert: Story = {
  args: {
    variant: 'medical-alert',
    children: 'Alerta',
  },
};

export const MedicalOutline: Story = {
  args: {
    variant: 'medical-outline',
    children: 'Outline Médico',
  },
};

export const MedicalGhost: Story = {
  args: {
    variant: 'medical-ghost',
    children: 'Ghost Médico',
  },
};

// Tamanhos
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Pequeno',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Grande',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: <Settings className="h-4 w-4" />,
  },
};

// Com ícones
export const WithIcon: Story = {
  args: {
    variant: 'medical',
    children: (
      <>
        <Activity className="mr-2 h-4 w-4" />
        Nova Consulta
      </>
    ),
  },
};

export const WithHeartIcon: Story = {
  args: {
    variant: 'medical-success',
    children: (
      <>
        <Heart className="mr-2 h-4 w-4" />
        Monitorar Paciente
      </>
    ),
  },
};

export const WithPlusIcon: Story = {
  args: {
    variant: 'medical-outline',
    children: (
      <>
        <Plus className="mr-2 h-4 w-4" />
        Adicionar
      </>
    ),
  },
};

// Estados
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Desabilitado',
  },
};

export const Loading: Story = {
  args: {
    variant: 'medical',
    disabled: true,
    children: (
      <>
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Salvando...
      </>
    ),
  },
};

// Casos de uso médicos
export const SavePatient: Story = {
  args: {
    variant: 'medical',
    children: (
      <>
        <Save className="mr-2 h-4 w-4" />
        Salvar Paciente
      </>
    ),
  },
};

export const EmergencyAlert: Story = {
  args: {
    variant: 'medical-alert',
    size: 'lg',
    children: (
      <>
        <Activity className="mr-2 h-4 w-4" />
        EMERGÊNCIA
      </>
    ),
  },
};

// Grupo de botões médicos
export const MedicalButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="medical">
        <Activity className="mr-2 h-4 w-4" />
        Consulta
      </Button>
      <Button variant="medical-success">
        <Heart className="mr-2 h-4 w-4" />
        Monitorar
      </Button>
      <Button variant="medical-outline">
        <Plus className="mr-2 h-4 w-4" />
        Adicionar
      </Button>
      <Button variant="medical-alert">Emergência</Button>
    </div>
  ),
};

export const SmallButton: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};
