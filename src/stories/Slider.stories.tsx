import { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Heart, Thermometer, Activity, Gauge } from 'lucide-react';

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Componente de slider para seleção de valores numéricos, ideal para configurações médicas, sinais vitais e parâmetros de saúde.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Slider>;

function SliderDemo({
  defaultValue = [50],
  min = 0,
  max = 100,
  step = 1,
  label = 'Valor',
  unit = '',
  icon,
  getStatusColor,
  disabled = false,
}: {
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  icon?: React.ReactNode;
  getStatusColor?: (value: number) => string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const currentValue = value[0];
  const statusColor = getStatusColor ? getStatusColor(currentValue) : '';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <Label className="text-sm font-medium">{label}</Label>
      </div>
      <Slider
        value={value}
        onValueChange={setValue}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="w-full"
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {min}
          {unit}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-semibold ${statusColor}`}>
            {currentValue}
            {unit}
          </span>
          {getStatusColor && (
            <Badge
              variant={
                currentValue < 60
                  ? 'destructive'
                  : currentValue > 100
                    ? 'destructive'
                    : 'default'
              }
            >
              {currentValue < 60
                ? 'Baixo'
                : currentValue > 100
                  ? 'Alto'
                  : 'Normal'}
            </Badge>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

export const Basico: Story = {
  render: () => (
    <div className="w-[300px]">
      <SliderDemo />
    </div>
  ),
};

export const FrequenciaCardiaca: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Frequência Cardíaca
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SliderDemo
          defaultValue={[72]}
          min={40}
          max={200}
          step={1}
          label="BPM (Batimentos por Minuto)"
          unit=" bpm"
          icon={<Heart className="h-4 w-4 text-red-500" />}
          getStatusColor={value => {
            if (value < 60 || value > 100) return 'text-red-500';
            return 'text-green-500';
          }}
        />
      </CardContent>
    </Card>
  ),
};

export const Temperatura: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-orange-500" />
          Temperatura Corporal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SliderDemo
          defaultValue={[36.5]}
          min={35}
          max={42}
          step={0.1}
          label="Temperatura (°C)"
          unit="°C"
          icon={<Thermometer className="h-4 w-4 text-orange-500" />}
          getStatusColor={value => {
            if (value < 36 || value > 37.5) return 'text-red-500';
            return 'text-green-500';
          }}
        />
      </CardContent>
    </Card>
  ),
};

export const PressaoArterial: Story = {
  render: () => {
    const [sistolica, setSistolica] = useState([120]);
    const [diastolica, setDiastolica] = useState([80]);

    const getStatusBadge = (sis: number, dia: number) => {
      if (sis < 90 || dia < 60)
        return <Badge variant="destructive">Hipotensão</Badge>;
      if (sis > 140 || dia > 90)
        return <Badge variant="destructive">Hipertensão</Badge>;
      if (sis > 120 || dia > 80)
        return <Badge variant="secondary">Pré-hipertensão</Badge>;
      return <Badge variant="default">Normal</Badge>;
    };

    return (
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Pressão Arterial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <Label className="text-sm font-medium">Pressão Sistólica</Label>
            </div>
            <Slider
              value={sistolica}
              onValueChange={setSistolica}
              min={70}
              max={200}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">70 mmHg</span>
              <span className="text-lg font-semibold">{sistolica[0]} mmHg</span>
              <span className="text-sm text-muted-foreground">200 mmHg</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <Label className="text-sm font-medium">Pressão Diastólica</Label>
            </div>
            <Slider
              value={diastolica}
              onValueChange={setDiastolica}
              min={40}
              max={120}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">40 mmHg</span>
              <span className="text-lg font-semibold">
                {diastolica[0]} mmHg
              </span>
              <span className="text-sm text-muted-foreground">120 mmHg</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="text-2xl font-bold">
                {sistolica[0]}/{diastolica[0]} mmHg
              </div>
              <div className="text-sm text-muted-foreground">
                Pressão Arterial
              </div>
            </div>
            {getStatusBadge(sistolica[0], diastolica[0])}
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const SaturacaoOxigenio: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-blue-500" />
          Saturação de Oxigênio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SliderDemo
          defaultValue={[98]}
          min={70}
          max={100}
          step={1}
          label="SpO2 (%)"
          unit="%"
          icon={<Gauge className="h-4 w-4 text-blue-500" />}
          getStatusColor={value => {
            if (value < 95) return 'text-red-500';
            if (value < 98) return 'text-yellow-500';
            return 'text-green-500';
          }}
        />
      </CardContent>
    </Card>
  ),
};

export const DoseMedicamento: Story = {
  render: () => {
    const [dose, setDose] = useState([250]);
    const peso = 70; // kg do paciente
    const dosePorKg = (dose[0] / peso).toFixed(1);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Dosagem de Medicamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label className="text-sm font-medium">Dose Total (mg)</Label>
            <Slider
              value={dose}
              onValueChange={setDose}
              min={50}
              max={1000}
              step={25}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">50 mg</span>
              <span className="text-lg font-semibold">{dose[0]} mg</span>
              <span className="text-sm text-muted-foreground">1000 mg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">Dose por kg</div>
              <div className="text-lg font-semibold">{dosePorKg} mg/kg</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Peso do paciente
              </div>
              <div className="text-lg font-semibold">{peso} kg</div>
            </div>
          </div>

          <div className="flex justify-center">
            <Badge
              variant={parseFloat(dosePorKg) > 10 ? 'destructive' : 'default'}
            >
              {parseFloat(dosePorKg) > 10 ? 'Dose Alta' : 'Dose Normal'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const IdadePaciente: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Idade do Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <SliderDemo
          defaultValue={[35]}
          min={0}
          max={120}
          step={1}
          label="Idade"
          unit=" anos"
          getStatusColor={value => {
            if (value < 18) return 'text-blue-500';
            if (value > 65) return 'text-orange-500';
            return 'text-green-500';
          }}
        />
      </CardContent>
    </Card>
  ),
};

export const NivelDor: Story = {
  render: () => {
    const [dor, setDor] = useState([3]);

    const getCorDor = (nivel: number) => {
      if (nivel <= 3) return 'text-green-500';
      if (nivel <= 6) return 'text-yellow-500';
      return 'text-red-500';
    };

    const getDescricaoDor = (nivel: number) => {
      if (nivel === 0) return 'Sem dor';
      if (nivel <= 3) return 'Dor leve';
      if (nivel <= 6) return 'Dor moderada';
      return 'Dor intensa';
    };

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Escala de Dor (0-10)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label className="text-sm font-medium">Nível de Dor</Label>
            <Slider
              value={dor}
              onValueChange={setDor}
              min={0}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">0</span>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getCorDor(dor[0])}`}>
                  {dor[0]}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getDescricaoDor(dor[0])}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">10</span>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">
              Orientações:
            </div>
            <div className="text-sm">
              {dor[0] === 0 && 'Paciente não relata dor.'}
              {dor[0] >= 1 &&
                dor[0] <= 3 &&
                'Dor leve - monitorar e considerar analgésicos simples.'}
              {dor[0] >= 4 &&
                dor[0] <= 6 &&
                'Dor moderada - considerar analgésicos mais potentes.'}
              {dor[0] >= 7 && 'Dor intensa - intervenção imediata necessária.'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const RangeValores: Story = {
  render: () => {
    const [range, setRange] = useState([20, 80]);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Faixa de Valores Normais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Faixa de Referência (%)
            </Label>
            <Slider
              value={range}
              onValueChange={setRange}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">0%</span>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {range[0]}% - {range[1]}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Faixa: {range[1] - range[0]}%
                </div>
              </div>
              <span className="text-sm text-muted-foreground">100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const SliderDesabilitado: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Slider Desabilitado</CardTitle>
      </CardHeader>
      <CardContent>
        <SliderDemo
          defaultValue={[65]}
          min={0}
          max={100}
          label="Valor Bloqueado"
          unit="%"
          disabled={true}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Este slider está desabilitado e não pode ser modificado.
        </p>
      </CardContent>
    </Card>
  ),
};

export const MultiplosSinaisVitais: Story = {
  render: () => {
    const [fc, setFc] = useState([72]);
    const [temp, setTemp] = useState([36.5]);
    const [spo2, setSpo2] = useState([98]);
    const [pa, setPa] = useState([120, 80]);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-red-500" />
              Frequência Cardíaca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Slider
              value={fc}
              onValueChange={setFc}
              min={40}
              max={200}
              step={1}
              className="w-full"
            />
            <div className="text-center">
              <div className="text-xl font-bold">{fc[0]} bpm</div>
              <Badge
                variant={fc[0] < 60 || fc[0] > 100 ? 'destructive' : 'default'}
              >
                {fc[0] < 60 || fc[0] > 100 ? 'Anormal' : 'Normal'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Thermometer className="h-4 w-4 text-orange-500" />
              Temperatura
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Slider
              value={temp}
              onValueChange={setTemp}
              min={35}
              max={42}
              step={0.1}
              className="w-full"
            />
            <div className="text-center">
              <div className="text-xl font-bold">{temp[0]}°C</div>
              <Badge
                variant={
                  temp[0] < 36 || temp[0] > 37.5 ? 'destructive' : 'default'
                }
              >
                {temp[0] < 36 || temp[0] > 37.5 ? 'Anormal' : 'Normal'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Gauge className="h-4 w-4 text-blue-500" />
              Saturação O2
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Slider
              value={spo2}
              onValueChange={setSpo2}
              min={70}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="text-center">
              <div className="text-xl font-bold">{spo2[0]}%</div>
              <Badge variant={spo2[0] < 95 ? 'destructive' : 'default'}>
                {spo2[0] < 95 ? 'Baixo' : 'Normal'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-purple-500" />
              Pressão Arterial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Sistólica</div>
              <Slider
                value={[pa[0]]}
                onValueChange={value => setPa([value[0], pa[1]])}
                min={70}
                max={200}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Diastólica</div>
              <Slider
                value={[pa[1]]}
                onValueChange={value => setPa([pa[0], value[0]])}
                min={40}
                max={120}
                step={1}
                className="w-full"
              />
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                {pa[0]}/{pa[1]} mmHg
              </div>
              <Badge
                variant={pa[0] > 140 || pa[1] > 90 ? 'destructive' : 'default'}
              >
                {pa[0] > 140 || pa[1] > 90 ? 'Hipertensão' : 'Normal'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};
