# MedAssist Pro: O Escriba de IA (Lean Manifesto)

**Visão:** Um sistema médico de fluxo único onde o médico grava a consulta e a IA gera toda a documentação clínica sob demanda via comandos simples.

---

## 🎯 O Problema #1: Burocracia Médica

Médicos gastam ~40% do tempo preenchendo prontuários e receitas. O MedAssist Pro resolve isso eliminando a digitação manual e focando na **captura de voz e extração de contexto**.

## 🏗️ Arquitetura Enxuta (The Lean Stack)

Para manter o app rápido e focado, utilizaremos:

- **Input:** `react-media-recorder` (Captura de áudio local).
- **Cérebro:** `MCP` (Model Context Protocol) para manter o contexto da consulta vivo.
- **Backend:** `Supabase Edge Functions` para transcrição (Whisper) e orquestração de LLM.
- **UI:** `shadcn/ui` (Apenas o necessário: Record Button + Chat/Command Bar).
- **Output:** `jspdf` (PDFs clínicos estruturados).

---

## 🕹️ Interface de Fluxo Único (MVP)

### 1. Gravação (The Record)

- Um botão central de "Gravar Consulta".
- Visualização de onda sonora simples.
- Stop -> Envio automático para transcrição.

### 2. Comandos Inteligentes (The Command Bar)

Após a gravação, o médico usa comandos `/` para gerar documentos baseados no que foi falado:

| Comando           | Ação da IA                                        | Resultado (Output)               |
| :---------------- | :------------------------------------------------ | :------------------------------- |
| `/prontuario`     | Resume anamnese, exame físico e conduta.          | Texto estruturado no prontuário. |
| `/receita`        | Extrai medicamentos e doses mencionadas.          | PDF de Receituário Timbrado.     |
| `/atestado`       | Gera atestado com tempo de repouso e CID.         | PDF de Atestado Médico.          |
| `/encaminhamento` | Cria guia para especialista com suspeita clínica. | PDF de Encaminhamento.           |
| `/resumo`         | Gera um sumário de 1 parágrafo para o paciente.   | Texto para WhatsApp/Email.       |

---

## 🧹 O que DELETAR (O "Lixo" do Código)

Para ser enxuto, **não** implementaremos (ou removeremos se já existir):

- [ ] Dashboards complexos com gráficos (Recharts).
- [ ] Sistema de faturamento e notas fiscais.
- [ ] Gestão de estoque de medicamentos.
- [ ] Chat entre médicos ou fóruns internos.
- [ ] Portal do paciente com login complexo (Foco é a ferramenta do médico).

---

## 🚀 Próximos Passos para o @dev

1. **Limpeza de UI:** Criar uma `HomeView` que contenha apenas o Botão de Gravação e a Barra de Comandos.
2. **Pipeline de Áudio:** Integrar o recorder com o Supabase Storage/Edge Function para transcrição rápida.
3. **Prompt Engineering:** Definir os prompts para cada comando `/` garantindo que a IA use apenas o contexto da consulta gravada.
4. **PDF Templates:** Criar templates fixos e limpos para os outputs.

---

_Documento gerado por Atlas (Analyst) - AIOS Framework_
