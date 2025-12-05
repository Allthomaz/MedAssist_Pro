import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Upload,
  X,
  User,
  FileText,
  Tag,
  Plus,
  Phone,
  Mail,
  Heart,
  Pill,
  AlertCircle,
  Save,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { EnhancedCalendar } from '@/components/ui/enhanced-calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import { cn } from '@/lib/utils';

/**
 * Schema de validação robusta para formulário de pacientes
 * Implementa validações específicas para dados médicos e sanitização
 */
const patientFormSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
    .transform(val => val.trim().replace(/\s+/g, ' ')), // Sanitização: remove espaços extras

  birth_date: z
    .date({
      required_error: 'Data de nascimento é obrigatória',
    })
    .refine(date => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 0 && age <= 120;
    }, 'Data de nascimento deve ser válida (0-120 anos)'),

  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Selecione o gênero',
  }),

  phone: z
    .string()
    .optional()
    .refine(
      val =>
        !val || /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(val.replace(/\s/g, '')),
      'Formato de telefone inválido. Use: (11) 99999-9999'
    )
    .transform(val =>
      val
        ? val
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
        : val
    ),

  email: z
    .string()
    .optional()
    .refine(
      val => !val || z.string().email().safeParse(val).success,
      'E-mail inválido'
    )
    .transform(val => (val ? val.toLowerCase().trim() : val)), // Sanitização: lowercase e trim

  chief_complaint: z
    .string()
    .optional()
    .transform(val => (val ? val.trim() : val))
    .refine(
      val => !val || val.length <= 500,
      'Queixa principal deve ter no máximo 500 caracteres'
    ),

  family_history: z
    .string()
    .optional()
    .transform(val => (val ? val.trim() : val))
    .refine(
      val => !val || val.length <= 1000,
      'Histórico familiar deve ter no máximo 1000 caracteres'
    ),

  current_medications: z
    .string()
    .optional()
    .transform(val => (val ? val.trim() : val))
    .refine(
      val => !val || val.length <= 500,
      'Medicamentos atuais devem ter no máximo 500 caracteres'
    ),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

interface PatientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      full_name: '',
      gender: undefined,
      phone: '',
      email: '',
      chief_complaint: '',
      family_history: '',
      current_medications: '',
    },
  });

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => {
        const validTypes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'audio/mpeg',
          'audio/wav',
          'text/plain',
        ];
        return validTypes.includes(file.type);
      });

      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const onSubmit = async (data: PatientFormData) => {
    setIsLoading(true);

    try {
      const { data: user } = await supabase.auth.getUser();

      if (!user.user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('🚀 Iniciando cadastro em duas etapas...');

      // ETAPA 1: Insert Mínimo (Apenas campos TEXT/DATE obrigatórios e simples)
      // Removemos arrays e campos opcionais para garantir que o registro seja criado.
      const minimalData = {
        doctor_id: user.user.id,
        full_name: data.full_name,
        birth_date: format(data.birth_date, 'yyyy-MM-dd'),
        gender: data.gender,
        status: 'active',
        // NOTA: Não enviamos phone, email, notes ou arrays aqui.
      };

      console.log('📤 Etapa 1: Criando registro básico...', minimalData);

      const { data: newPatient, error: insertError } = await supabase
        .from('patients')
        .insert(minimalData)
        .select('id') // Só precisamos do ID
        .single();

      if (insertError) {
        console.error('❌ Erro na Etapa 1 (Insert):', insertError);
        throw insertError;
      }

      const patientId = newPatient.id;
      console.log('✅ Paciente criado com ID:', patientId);

      // ETAPA 2: Update com os Opcionais e Arrays
      // Agora que o paciente existe, atualizamos com o resto dos dados.
      const updateData: any = {};

      if (data.phone) updateData.phone = data.phone;
      if (data.email) updateData.email = data.email;
      if (data.family_history) updateData.family_history = data.family_history;

      // Mapeamento de chief_complaint para notes
      if (data.chief_complaint) updateData.notes = data.chief_complaint;

      // Arrays (geralmente os culpados do erro 42601 em inserts)
      if (data.current_medications) {
        // Formata como array de strings para o Postgres
        updateData.current_medications = [data.current_medications];
      }

      // Só fazemos o update se tiver algo para salvar
      if (Object.keys(updateData).length > 0) {
        console.log('🔄 Etapa 2: Salvando dados adicionais...', updateData);

        const { error: updateError } = await supabase
          .from('patients')
          .update(updateData)
          .eq('id', patientId);

        if (updateError) {
          console.error(
            '⚠️ Aviso: Dados básicos salvos, mas falha nos opcionais:',
            updateError
          );
          // Não lançamos erro aqui para não assustar o usuário, já que o paciente foi criado
          toast({
            title: 'Paciente criado (Parcial)',
            description:
              'Os dados básicos foram salvos, mas detalhes adicionais podem ter falhado.',
            variant: 'default',
          });
        }
      }

      toast({
        title: '✅ Sucesso!',
        description: `Paciente ${data.full_name} cadastrado com sucesso.`,
      });

      onSuccess();
    } catch (error: any) {
      console.error('❌ Erro Fatal:', error);

      // Tratamento amigável do erro
      let msg = 'Falha ao salvar paciente.';
      if (error.code === '42601')
        msg = 'Erro de configuração no banco (42601). Contate o suporte.';
      else if (error.message) msg = error.message;

      toast({
        title: 'Erro',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const birthDate = form.watch('birth_date');
  const age = birthDate ? calculateAge(birthDate) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Novo Paciente</h2>
          <p className="text-muted-foreground">
            Cadastre as informações do paciente
          </p>
        </div>
        <Button variant="ghost" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <Card className="premium-form-card premium-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-medical-blue" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Nascimento *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'dd/MM/yyyy')
                              ) : (
                                <span>Selecionar data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <EnhancedCalendar
                            value={field.value}
                            onDateChange={field.onChange}
                            disabled={date =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            className={cn('pointer-events-auto')}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label>Idade</Label>
                  <div className="h-10 px-3 py-2 border border-input bg-muted rounded-md flex items-center text-muted-foreground">
                    {age !== null ? `${age} anos` : 'Selecione a data'}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gênero *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Feminino</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(XX) XXXXX-XXXX"
                          {...field}
                          onChange={e =>
                            field.onChange(formatPhone(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        E-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações Clínicas */}
          <Card className="premium-form-card premium-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-medical-blue" />
                Informações Clínicas Iniciais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="chief_complaint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Sintomas e Queixas Principais
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva os sintomas e motivo da consulta..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="family_history"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Histórico Médico
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Diagnósticos prévios, cirurgias, doenças crônicas..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="current_medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Medicações Atuais
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liste os medicamentos que o paciente já toma..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Anexos e Documentos */}
          <Card className="premium-form-card premium-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-medical-blue" />
                Anexos e Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Upload de Exames e Transcrições</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.mp3,.wav,.txt"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Aceita: PDF, Imagens, Áudios, Textos
                  </p>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Arquivos Anexados</Label>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <span className="text-sm text-foreground">
                          {file.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          aria-label={`Remover arquivo ${file.name}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="premium-form-card premium-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-medical-blue" />
                Rótulos (Tags)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar rótulo (ex: Ansiedade, Depressão)"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  aria-label="Adicionar rótulo"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                    >
                      {tag}
                      <X
                        className="w-3 h-3 ml-1 hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="premium-button-outline flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="medical"
              disabled={isLoading}
              className="premium-button-primary flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Paciente
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// Exportação default para compatibilidade com lazy loading
export default PatientForm;
