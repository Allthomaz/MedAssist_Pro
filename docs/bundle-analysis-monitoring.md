# Bundle Analysis & Monitoring Setup

## 📊 Bundle Analysis com Rollup Plugin Visualizer

### Instalação

```bash
npm install --save-dev rollup-plugin-visualizer
```

### Configuração

O plugin está configurado no `vite.config.ts` para gerar análises detalhadas do bundle:

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

### Como Usar

1. Execute o build: `npm run build`
2. O arquivo `dist/stats.html` será gerado automaticamente
3. Abra o arquivo no navegador para visualizar:
   - Tamanho dos chunks
   - Dependências e suas relações
   - Análise de compressão (gzip/brotli)

### Benefícios

- **Identificação de dependências grandes**: Visualize quais bibliotecas ocupam mais espaço
- **Otimização de chunks**: Analise a divisão de código e otimize o carregamento
- **Detecção de duplicações**: Encontre código duplicado entre chunks
- **Análise de compressão**: Compare tamanhos antes e depois da compressão

## 🔍 Monitoramento de Erros com Sentry

### Instalação

```bash
npm install --save @sentry/react @sentry/vite-plugin
```

### Configuração

#### 1. Variáveis de Ambiente

Adicione ao seu arquivo `.env`:

```env
# Sentry Configuration
VITE_SENTRY_DSN=https://sua_sentry_dsn_aqui
SENTRY_ORG=sua_organizacao_sentry
SENTRY_PROJECT=seu_projeto_sentry
SENTRY_AUTH_TOKEN=seu_auth_token_sentry
```

#### 2. Configuração do Vite

O plugin do Sentry está configurado no `vite.config.ts`:

```typescript
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  plugins: [
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
});
```

#### 3. Inicialização do Sentry

O Sentry é inicializado em `src/sentry.ts` e importado no `main.tsx`:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.MODE,
});
```

### Funcionalidades Ativas

#### Performance Monitoring

- **Rastreamento de transações**: Monitora performance de páginas e componentes
- **Core Web Vitals**: Coleta métricas de experiência do usuário
- **API Calls**: Rastreia chamadas para APIs externas

#### Error Tracking

- **Captura automática**: Erros JavaScript são automaticamente enviados
- **Context adicional**: Informações do usuário, navegador e ambiente
- **Stack traces**: Rastreamento completo de erros

#### Session Replay

- **Gravação de sessões**: 10% das sessões são gravadas
- **Replay em erros**: 100% das sessões com erros são gravadas
- **Privacidade**: Textos e mídias podem ser mascarados

### Como Configurar o Sentry

1. **Criar conta**: Acesse [sentry.io](https://sentry.io) e crie uma conta
2. **Criar projeto**: Configure um novo projeto React
3. **Obter DSN**: Copie o DSN do projeto
4. **Configurar variáveis**: Adicione as variáveis no arquivo `.env`
5. **Deploy**: O monitoramento será ativo após o deploy

### Benefícios

- **Detecção proativa**: Identifique erros antes dos usuários reportarem
- **Performance insights**: Monitore a performance da aplicação
- **User experience**: Entenda como os usuários interagem com a aplicação
- **Debugging**: Reproduza erros com session replay
- **Alertas**: Configure notificações para erros críticos

## 🚀 Próximos Passos

1. **Configure o Sentry**: Adicione suas credenciais do Sentry no `.env`
2. **Analise o bundle**: Execute `npm run build` e analise o `stats.html`
3. **Otimize chunks**: Use as informações do visualizer para otimizar o carregamento
4. **Configure alertas**: Configure notificações no Sentry para erros críticos
5. **Monitore performance**: Acompanhe métricas de performance no dashboard do Sentry
