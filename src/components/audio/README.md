# Módulo de Áudio

Este módulo gerencia todas as funcionalidades relacionadas ao processamento de áudio médico no sistema Doctor Brief AI.

## Visão Geral

O módulo de áudio é responsável por:
- Gravação de áudio em tempo real
- Upload e gerenciamento de arquivos de áudio
- Transcrição automática usando OpenAI Whisper
- Reprodução e controle de áudio
- Integração com Supabase Storage

## Componentes Principais

### AudioManager.tsx
**Propósito**: Componente principal para gerenciamento completo de arquivos de áudio.

**Funcionalidades**:
- ✅ Listagem de gravações por consulta
- ✅ Upload de arquivos de áudio (formatos: mp3, wav, m4a, ogg)
- ✅ Validação robusta de arquivos (tamanho, tipo MIME, extensão)
- ✅ Transcrição automática via OpenAI Whisper
- ✅ Reprodução com controle de estado
- ✅ Download de arquivos
- ✅ Exclusão segura (storage + banco)

**Props**:
```typescript
interface AudioManagerProps {
  consultationId: string;
  onTranscriptionUpdate?: (recordingId: string, transcription: any) => void;
}
```

**Estados Gerenciados**:
- `audioFiles`: Lista de arquivos de áudio
- `loading`: Estado de carregamento
- `error`: Mensagens de erro
- `uploadingFile`: Estado de upload
- `playingAudio`: ID do áudio em reprodução
- `transcribingAudio`: ID do áudio sendo transcrito

## Hooks Utilizados

### useAudioRecorder
**Localização**: `src/hooks/useAudioRecorder.ts`

**Funcionalidades**:
- Gravação de áudio em tempo real
- Controle de permissões do microfone
- Gerenciamento de tempo de gravação
- Cleanup automático de recursos
- Callbacks para eventos de gravação

## Serviços Integrados

### transcribeAudio
**Localização**: `src/services/transcriptionService.ts`

**Configurações**:
- **Idioma**: Português brasileiro (pt)
- **Formato**: verbose_json (inclui timestamps)
- **Modelo**: OpenAI Whisper
- **Otimização**: Terminologia médica

### Supabase Storage
**Bucket**: `recordings`
**Configurações**:
- Tamanho máximo: 50MB por arquivo
- Tipos permitidos: audio/mpeg, audio/wav, audio/mp4, audio/ogg
- URLs assinadas com validade de 1 hora

## Estrutura de Dados

### AudioFile Interface
```typescript
interface AudioFile {
  id: string;
  consultation_id: string;
  audio_file_name: string;
  audio_file_path: string;
  duration_seconds?: number;
  recording_status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  file_size?: number;
  transcription?: any;
}
```

## Fluxo de Trabalho

### 1. Upload de Arquivo
```
Seleção do Arquivo → Validação → Upload para Storage → 
Salvar Metadados → Iniciar Transcrição → Atualizar Interface
```

### 2. Transcrição Automática
```
Arquivo Carregado → Chamar OpenAI Whisper → 
Processar Resposta → Salvar Transcrição → Notificar Componente Pai
```

### 3. Reprodução de Áudio
```
Solicitar Reprodução → Gerar URL Assinada → 
Criar Instância Audio → Configurar Listeners → Reproduzir
```

## Validações de Segurança

### Validação de Arquivos
- **Tamanho mínimo**: 1KB (evita arquivos corrompidos)
- **Tamanho máximo**: 50MB (otimiza performance)
- **Tipos MIME permitidos**: 
  - `audio/mpeg` (.mp3)
  - `audio/wav` (.wav)
  - `audio/mp4` (.m4a)
  - `audio/ogg` (.ogg)
- **Correspondência MIME/Extensão**: Validação cruzada

### Segurança de Acesso
- URLs assinadas para acesso aos arquivos
- Validação de propriedade por consulta
- Cleanup automático de recursos

## Tratamento de Erros

### Cenários Cobertos
- Falha na validação de arquivo
- Erro de upload para storage
- Falha na transcrição
- Erro de reprodução de áudio
- Problemas de conectividade

### Estratégias
- Mensagens de erro específicas para o usuário
- Logs detalhados para debugging
- Rollback automático em caso de falha
- Estados de loading apropriados

## Performance

### Otimizações Implementadas
- Lazy loading de arquivos de áudio
- Cleanup automático de URLs blob
- Cancelamento de requisições pendentes
- Controle de instância única para reprodução

### Métricas
- Tempo médio de upload: < 5s para arquivos de 10MB
- Tempo de transcrição: ~1min para 10min de áudio
- Uso de memória: Otimizado com cleanup automático

## Dependências

### Principais
- `@supabase/supabase-js`: Integração com backend
- `lucide-react`: Ícones da interface
- `react`: Framework base

### Serviços Externos
- **OpenAI Whisper**: Transcrição de áudio
- **Supabase Storage**: Armazenamento de arquivos
- **Supabase Database**: Metadados e transcrições

## Configuração

### Variáveis de Ambiente
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_OPENAI_API_URL=https://api.openai.com/v1/audio/transcriptions
```

### Configuração do Supabase
1. Criar bucket `recordings` no Storage
2. Configurar políticas RLS apropriadas
3. Configurar tabela `recordings` com campos necessários

## Uso

### Exemplo Básico
```tsx
import { AudioManager } from './components/audio/AudioManager';

function ConsultationPage({ consultationId }) {
  const handleTranscriptionUpdate = (recordingId, transcription) => {
    console.log('Nova transcrição:', transcription);
  };

  return (
    <AudioManager 
      consultationId={consultationId}
      onTranscriptionUpdate={handleTranscriptionUpdate}
    />
  );
}
```

## Roadmap

### Próximas Funcionalidades
- [ ] Suporte a mais formatos de áudio
- [ ] Transcrição em tempo real
- [ ] Análise de sentimento do áudio
- [ ] Compressão automática de arquivos
- [ ] Backup automático na nuvem

### Melhorias Planejadas
- [ ] Interface de edição de transcrições
- [ ] Marcadores temporais na reprodução
- [ ] Visualização de forma de onda
- [ ] Controles avançados de reprodução

## Contribuição

Para contribuir com este módulo:
1. Mantenha a documentação JSDoc atualizada
2. Adicione testes para novas funcionalidades
3. Siga os padrões de nomenclatura estabelecidos
4. Valide todas as entradas de usuário
5. Implemente tratamento de erro robusto

## Suporte

Para dúvidas ou problemas relacionados ao módulo de áudio:
- Verifique os logs do console para erros detalhados
- Confirme as configurações do Supabase
- Valide as permissões de microfone no navegador
- Teste a conectividade com a API da OpenAI