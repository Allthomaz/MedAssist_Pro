# Escopo de Trabalho (SOW): MedAssist Pro - MVP Escriba de IA

## 1. Visão Geral do Projeto

O MedAssist Pro é uma ferramenta de produtividade para médicos que elimina a digitação manual de prontuários e receitas. O sistema captura o áudio da consulta e, através de comandos de IA (NLP), gera documentos clínicos estruturados.

## 2. Stack Técnica Obrigatória

- **Frontend:** React 18, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend/BaaS:** Supabase (Auth, Database, Storage, Edge Functions).
- **IA/LLM:** Integração via Model Context Protocol (MCP) com Claude 3.5 Sonnet ou GPT-4o.
- **Transcrição:** OpenAI Whisper (via Edge Functions).
- **Processamento de Áudio:** `react-media-recorder`.
- **Geração de Documentos:** `jspdf` ou `react-pdf`.

## 3. Entregáveis de Desenvolvimento (Módulos)

### Módulo A: Interface de Captura (Single-Page App)

- Tela única minimalista com botão central de gravação (Start/Stop).
- Feedback visual de gravação ativa (waveform ou timer).
- Upload automático do blob de áudio para o Supabase Storage após o Stop.

### Módulo B: Pipeline de Transcrição e Contexto

- Implementação de Edge Function para envio do áudio ao Whisper.
- Armazenamento da transcrição vinculada à sessão da consulta.
- Inicialização do contexto da consulta via MCP para que a IA "memorize" os fatos narrados.

### Módulo C: Barra de Comandos "/" (The Command Engine)

- Input de chat/comando que aceita os seguintes atalhos:
  - `/prontuario`: Gera anamnese estruturada (Queixa principal, HDA, Exame Físico, Conduta).
  - `/receita`: Extrai medicamentos, doses e posologia.
  - `/atestado`: Gera documento com repouso e CID mencionado.
  - `/encaminhamento`: Gera guia para especialistas.
- Função de "Edição Assistida": O médico pode pedir ajustes via chat (ex: "adicione dipirona 500mg na receita").

### Módulo D: Exportação e Segurança

- Geração de PDF timbrado com os dados extraídos.
- Implementação de criptografia básica em repouso (Segurança LGPD).
- Logout automático após 30 min de inatividade.

## 4. Critérios de Aceitação (QA)

- O tempo entre o "Stop" e a disponibilidade para comandos deve ser < 10 segundos.
- Os PDFs gerados devem seguir o padrão de layout médico brasileiro.
- A IA não deve inventar (alucinar) medicamentos não mencionados ou não confirmados no chat.

## 5. Cronograma Estimado (Sugerido)

- **Semana 1:** Setup de infra, áudio e transcrição básica.
- **Semana 2:** Implementação do MCP e Comandos `/`.
- **Semana 3:** Geração de PDFs e Refinamento de UX/UI.
- **Semana 4:** Testes de segurança, correção de bugs e Deploy.

---

_Preparado por Atlas (Analyst) - AIOS Framework_
