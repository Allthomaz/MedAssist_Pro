import React, { useEffect, useMemo, useState } from "react";
import { MedicalLayout } from "@/components/layout/MedicalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { Calendar, FileText, Microscope, Paperclip, Plus, Search, Upload, User, Mic, StopCircle } from "lucide-react";

// Mock patients (replace with Supabase later)
const mockPatients = [
  { id: "p1", name: "Maria Silva Santos", email: "maria.silva@email.com" },
  { id: "p2", name: "João Carlos Oliveira", email: "joao.oliveira@email.com" },
  { id: "p3", name: "Ana Costa Lima", email: "ana.costa@email.com" },
];

// Mock documents (replace with Supabase later)
// type: prontuario | relatorio | exame | anexo
const mockDocuments = [
  { id: "d1", patientId: "p1", type: "prontuario", title: "Evolução Clínica", date: "2024-01-15", status: "final" },
  { id: "d2", patientId: "p1", type: "relatorio", title: "Laudo de Ultrassom", date: "2024-01-12", status: "rascunho" },
  { id: "d3", patientId: "p1", type: "exame", title: "Hemograma Completo", date: "2024-01-10", status: "final" },
  { id: "d4", patientId: "p2", type: "anexo", title: "Anexo – RX Tórax.pdf", date: "2024-01-08", status: "final" },
  { id: "d5", patientId: "p3", type: "relatorio", title: "Relatório de Retorno", date: "2024-01-05", status: "final" },
];

const Documents: React.FC = () => {
  const { toast } = useToast();
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[number] | null>(mockPatients[0]);
  const [query, setQuery] = useState("");
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    // SEO basics per page
    document.title = selectedPatient
      ? `Prontuário • ${selectedPatient.name} | MedAssist Pro`
      : "Prontuário | MedAssist Pro";
    const desc = "Prontuário do paciente com relatórios, exames e anexos.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `${window.location.origin}/documents`);
  }, [selectedPatient]);

  const patientDocuments = useMemo(() => {
    const docs = mockDocuments.filter((d) => d.patientId === selectedPatient?.id);
    if (!query) return docs;
    return docs.filter((d) => d.title.toLowerCase().includes(query.toLowerCase()));
  }, [selectedPatient, query]);

  const docsByType = useMemo(() => ({
    prontuario: patientDocuments.filter((d) => d.type === "prontuario"),
    relatorio: patientDocuments.filter((d) => d.type === "relatorio"),
    exame: patientDocuments.filter((d) => d.type === "exame"),
    anexo: patientDocuments.filter((d) => d.type === "anexo"),
  }), [patientDocuments]);

  const handleNewReport = () => {
    toast({ title: "Novo Laudo", description: "Abriremos o editor de laudos em breve (mock)." });
  };

  const handleUpload = () => {
    toast({ title: "Upload de Arquivo", description: "Envio de arquivos será conectado ao Supabase Storage.", });
  };

  const toggleRecording = () => {
    setRecording((r) => !r);
    toast({
      title: recording ? "Gravação encerrada" : "Gravação iniciada",
      description: recording
        ? "Transcrição será adicionada ao prontuário (mock)."
        : "Estamos capturando o áudio para transcrição (mock).",
    });
  };

  const renderTable = (items: typeof mockDocuments) => (
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
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Nenhum documento encontrado.
                </TableCell>
              </TableRow>
            )}
            {items.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={doc.status === "final" ? "border-green-500/30 text-green-600" : "border-yellow-500/30 text-yellow-600"}>
                    {doc.status === "final" ? "Final" : "Rascunho"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(doc.date).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="medical-outline">Visualizar</Button>
                    <Button size="sm" variant="outline">Editar</Button>
                    <Button size="sm" variant="ghost">Excluir</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <MedicalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Prontuário</h1>
            <p className="text-muted-foreground">Selecione um paciente para visualizar relatórios, exames e anexos.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setOpenPatientDialog(true)}>
              <User className="w-4 h-4" />
              {selectedPatient ? selectedPatient.name : "Selecionar paciente"}
            </Button>
            <Button variant="medical" className="gap-2" onClick={handleNewReport}>
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
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="prontuario" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="prontuario" className="gap-2"><FileText className="w-4 h-4" /> Prontuário</TabsTrigger>
            <TabsTrigger value="relatorios" className="gap-2"><FileText className="w-4 h-4" /> Relatórios</TabsTrigger>
            <TabsTrigger value="exames" className="gap-2"><Microscope className="w-4 h-4" /> Exames</TabsTrigger>
            <TabsTrigger value="anexos" className="gap-2"><Paperclip className="w-4 h-4" /> Anexos</TabsTrigger>
          </TabsList>

          <TabsContent value="prontuario">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Linha do tempo do paciente
              </div>
              <Button variant={recording ? "destructive" : "medical-outline"} className="gap-2" onClick={toggleRecording}>
                {recording ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {recording ? "Parar gravação" : "Gravar consulta"}
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
        </Tabs>

        {/* Supabase notice */}
        <Card className="bg-accent/50 border-medical-blue/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-medical-blue/10">
                <Upload className="w-5 h-5 text-medical-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Conecte ao Supabase para dados reais</h3>
                <p className="text-sm text-muted-foreground">
                  Documentos e uploads serão salvos no banco e no Storage do Supabase com segurança. Esta página usa dados de exemplo por enquanto.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient selector */}
      <CommandDialog open={openPatientDialog} onOpenChange={setOpenPatientDialog}>
        <CommandInput placeholder="Buscar paciente pelo nome ou email..." />
        <CommandList>
          <CommandEmpty>Nenhum paciente encontrado.</CommandEmpty>
          <CommandGroup heading="Pacientes">
            {mockPatients.map((p) => (
              <CommandItem
                key={p.id}
                value={`${p.name} ${p.email}`}
                onSelect={() => {
                  setSelectedPatient(p);
                  setOpenPatientDialog(false);
                }}
              >
                <User className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.email}</span>
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
