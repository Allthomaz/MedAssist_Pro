import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  Suspense,
  lazy,
} from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';

// Lazy load heavy components
const DocumentGenerator = lazy(() =>
  import('@/components/documents/DocumentGenerator').then(module => ({
    default: module.DocumentGenerator,
  }))
);
import {
  Calendar,
  FileText,
  Microscope,
  Paperclip,
  Plus,
  Search,
  Upload,
  User,
  Mic,
  StopCircle,
  Brain,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Patient = Database['public']['Tables']['patients']['Row'];
type Document = Database['public']['Tables']['documents']['Row'];

const Documents: React.FC = () => {
  const { toast } = useToast();
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [recording, setRecording] = useState(false);

  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('status', 'active')
          .order('full_name');

        if (error) throw error;

        setPatients(data || []);
        if (data && data.length > 0) {
          setSelectedPatient(data[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os pacientes.',
          variant: 'destructive',
        });
      }
    };

    fetchPatients();
  }, [toast]);

  // Fetch documents when patient changes
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!selectedPatient) {
        setDocuments([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('patient_id', selectedPatient.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setDocuments(data || []);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os documentos.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [selectedPatient, toast]);

  useEffect(() => {
    // SEO basics per page
    document.title = selectedPatient
      ? `Prontuário • ${selectedPatient.full_name} | MedAssist Pro`
      : 'Prontuário | MedAssist Pro';
    const desc = 'Prontuário do paciente com relatórios, exames e anexos.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', `${window.location.origin}/documents`);
  }, [selectedPatient]);

  const filteredDocuments = useMemo(() => {
    if (!selectedPatient || !documents) return [];
    return documents.filter(
      doc =>
        query === '' ||
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        (doc.description &&
          doc.description.toLowerCase().includes(query.toLowerCase()))
    );
  }, [documents, query, selectedPatient]);

  const docsByType = useMemo(() => {
    return {
      prontuario: filteredDocuments.filter(
        d => d.document_type === 'prontuario'
      ),
      relatorio: filteredDocuments.filter(d => d.document_type === 'relatorio'),
      exame: filteredDocuments.filter(d => d.document_type === 'exame'),
      anexo: filteredDocuments.filter(d => d.document_type === 'anexo'),
    };
  }, [filteredDocuments]);

  const handleNewReport = useCallback(() => {
    toast({
      title: 'Novo Laudo',
      description: 'Abriremos o editor de laudos em breve (mock).',
    });
  }, [toast]);

  const handleUpload = useCallback(() => {
    toast({
      title: 'Upload de Arquivo',
      description: 'Envio de arquivos será conectado ao Supabase Storage.',
    });
  }, [toast]);

  const toggleRecording = useCallback(() => {
    setRecording(r => !r);
    toast({
      title: recording ? 'Gravação encerrada' : 'Gravação iniciada',
      description: recording
        ? 'Transcrição será adicionada ao prontuário (mock).'
        : 'Estamos capturando o áudio para transcrição (mock).',
    });
  }, [recording, toast]);

  const renderTable = (docs: Document[]) => {
    if (loading) {
      return (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin mb-4" />
              <p className="text-muted-foreground">Carregando documentos...</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[160px]">Data</TableHead>
                <TableHead className="w-[200px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8"
                  >
                    Nenhum documento encontrado.
                  </TableCell>
                </TableRow>
              )}
              {docs.map(doc => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{doc.title}</div>
                      {doc.description && (
                        <div className="text-sm text-muted-foreground">
                          {doc.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        doc.status === 'final'
                          ? 'border-green-500/30 text-green-600'
                          : 'border-yellow-500/30 text-yellow-600'
                      }
                    >
                      {doc.status === 'final'
                        ? 'Final'
                        : doc.status === 'draft'
                          ? 'Rascunho'
                          : doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="medical-outline">
                        Visualizar
                      </Button>
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost">
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <MedicalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Prontuário</h1>
            <p className="text-muted-foreground">
              Selecione um paciente para visualizar relatórios, exames e anexos.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setOpenPatientDialog(true)}
            >
              <User className="w-4 h-4" />
              {selectedPatient
                ? selectedPatient.full_name
                : 'Selecionar paciente'}
            </Button>
            <Button
              variant="medical"
              className="gap-2"
              onClick={handleNewReport}
            >
              <Plus className="w-4 h-4" />
              Novo Laudo
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleUpload}>
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por título..."
                className="pl-10"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="prontuario" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="prontuario" className="gap-2">
              <FileText className="w-4 h-4" /> Prontuário
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="gap-2">
              <FileText className="w-4 h-4" /> Relatórios
            </TabsTrigger>
            <TabsTrigger value="exames" className="gap-2">
              <Microscope className="w-4 h-4" /> Exames
            </TabsTrigger>
            <TabsTrigger value="anexos" className="gap-2">
              <Paperclip className="w-4 h-4" /> Anexos
            </TabsTrigger>
            <TabsTrigger value="gerador" className="gap-2">
              <Brain className="w-4 h-4" /> Gerar Documento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prontuario">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Linha do tempo do paciente
              </div>
              <Button
                variant={recording ? 'destructive' : 'medical-outline'}
                className="gap-2"
                onClick={toggleRecording}
              >
                {recording ? (
                  <StopCircle className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
                {recording ? 'Parar gravação' : 'Gravar consulta'}
              </Button>
            </div>
            {renderTable(docsByType.prontuario)}
          </TabsContent>

          <TabsContent value="relatorios">
            {renderTable(docsByType.relatorio)}
          </TabsContent>

          <TabsContent value="exames">
            {renderTable(docsByType.exame)}
          </TabsContent>

          <TabsContent value="anexos">
            {renderTable(docsByType.anexo)}
          </TabsContent>

          <TabsContent value="gerador">
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">
                    Carregando gerador de documentos...
                  </span>
                </div>
              }
            >
              <DocumentGenerator
                onDocumentGenerated={document => {
                  toast({
                    title: 'Documento Gerado',
                    description: `${document.title} foi gerado com sucesso!`,
                  });
                }}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>

      {/* Patient selector */}
      <CommandDialog
        open={openPatientDialog}
        onOpenChange={setOpenPatientDialog}
      >
        <CommandInput placeholder="Buscar paciente pelo nome ou email..." />
        <CommandList>
          <CommandEmpty>Nenhum paciente encontrado.</CommandEmpty>
          <CommandGroup heading="Pacientes">
            {patients.map(p => (
              <CommandItem
                key={p.id}
                value={`${p.full_name} ${p.email}`}
                onSelect={() => {
                  setSelectedPatient(p);
                  setOpenPatientDialog(false);
                }}
              >
                <User className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{p.full_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {p.email}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </MedicalLayout>
  );
};

export default Documents;
