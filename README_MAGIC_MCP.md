# Magic MCP Integration - MedAssist Pro

## Visão Geral

O Magic MCP é uma ferramenta de IA integrada ao MedAssist Pro que permite gerar componentes médicos personalizados usando inteligência artificial. Esta integração utiliza a API do 21st.dev para criar interfaces médicas avançadas.

## Configuração

### 1. Credenciais

As credenciais do Magic MCP estão configuradas no arquivo `.env`:

```env
TWENTYFIRST_API_KEY="2f1cd8f8-0b6b-4c88-8286-489f52f3ab9e"
TWENTYFIRST_PROFILE="loose-cicada-gZTGeu"
```

### 2. Configuração MCP

O arquivo `mcp-config.json` contém a configuração do servidor MCP:

```json
{
  "mcpServers": {
    "magic-mcp": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@smithery/cli@latest",
        "run",
        "@21st-dev/magic-mcp",
        "--key",
        "2f1cd8f8-0b6b-4c88-8286-489f52f3ab9e",
        "--profile",
        "loose-cicada-gZTGeu"
      ]
    }
  }
}
```

## Como Usar

### 1. Acessar o Magic MCP

1. Navegue para a página "Magic MCP" no menu lateral
2. Você verá três abas: **Gerador**, **Exemplos** e **Documentação**

### 2. Gerar Componentes

#### Aba Gerador

1. **Descrição**: Digite uma descrição detalhada do componente médico que deseja criar
   - Exemplo: "Formulário de prescrição médica com campos para medicamento, dosagem e instruções"

2. **Tipo de Componente**: Selecione o tipo:
   - **Formulário**: Para entrada de dados médicos
   - **Card**: Para exibir informações resumidas
   - **Tabela**: Para listar dados estruturados
   - **Diálogo**: Para modais e pop-ups
   - **Dashboard**: Para painéis de controle
   - **Gráfico**: Para visualizações de dados

3. **Especialidade Médica** (opcional): Especifique a área médica
   - Cardiologia, Pediatria, Neurologia, etc.

4. **Campos** (opcional): Liste campos específicos separados por vírgula

5. **Ações Disponíveis**:
   - **Gerar**: Cria o componente usando IA
   - **Inspiração**: Busca componentes similares para referência
   - **Logos**: Procura logos médicos relacionados

### 3. Exemplos Pré-configurados

#### Aba Exemplos

Veja componentes médicos já criados:

- **Card de Sinais Vitais**: Exibe pressão arterial, frequência cardíaca, etc.
- **Formulário de Prescrição**: Para criar receitas médicas
- **Dashboard do Paciente**: Visão geral dos dados do paciente

### 4. Funcionalidades Avançadas

#### Busca de Inspiração

- Encontra componentes similares no 21st.dev
- Fornece código de referência
- Ajuda na criação de interfaces mais elaboradas

#### Refinamento de Componentes

- Melhora componentes existentes
- Adiciona funcionalidades específicas
- Otimiza o design e usabilidade

#### Biblioteca de Logos

- Acesso a logos médicos profissionais
- Formatos: JSX, TSX, SVG
- Categorias: hospitais, clínicas, especialidades

## Estrutura Técnica

### Arquivos Principais

- `src/services/magicMcpService.ts`: Serviço principal de integração
- `src/hooks/useMagicMcp.ts`: Hook React para usar o Magic MCP
- `src/components/magic/MagicComponentGenerator.tsx`: Interface do gerador
- `src/components/examples/MedicalComponentExamples.tsx`: Exemplos pré-configurados
- `src/pages/MagicMcp.tsx`: Página principal do Magic MCP

### Tecnologias Utilizadas

- **21st.dev API**: Geração de componentes com IA
- **Model Context Protocol (MCP)**: Protocolo de comunicação
- **React/TypeScript**: Interface do usuário
- **Tailwind CSS**: Estilização
- **Shadcn/ui**: Componentes base

## Segurança e Boas Práticas

### Proteção de Dados

- As credenciais são armazenadas em variáveis de ambiente
- Não há exposição de chaves API no código cliente
- Validação de entrada antes do processamento

### Conformidade Médica

- Componentes seguem padrões de UI/UX médicos
- Validação de campos obrigatórios
- Estrutura compatível com LGPD/HIPAA

### Performance

- Carregamento dinâmico de ferramentas
- Fallbacks para ambiente de navegador
- Cache de componentes gerados

## Troubleshooting

### Problemas Comuns

1. **Erro de API Key**:
   - Verifique se a chave está correta no `.env`
   - Confirme se o perfil está ativo no 21st.dev

2. **Componente não gera**:
   - Verifique a conexão com internet
   - Tente uma descrição mais específica
   - Verifique os logs do console

3. **Erro de importação**:
   - Certifique-se de que as dependências estão instaladas
   - Execute `npm install` novamente

### Logs e Debug

- Abra o console do navegador (F12)
- Verifique a aba "Network" para requisições
- Logs do Magic MCP aparecem no console

## Suporte

Para suporte técnico:

1. Verifique a documentação do 21st.dev
2. Consulte os logs de erro
3. Teste com exemplos simples primeiro
4. Verifique se todas as dependências estão atualizadas

## Atualizações

Para atualizar o Magic MCP:

```bash
npm update @smithery/cli
```

O sistema usa sempre a versão mais recente via `npx -y`.