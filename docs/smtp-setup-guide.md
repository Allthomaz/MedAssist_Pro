# 📧 Guia de Configuração SMTP - MedAssist

Este guia fornece instruções passo a passo para configurar o envio de emails no MedAssist usando diferentes provedores SMTP.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração SendGrid](#configuração-sendgrid)
3. [Configuração AWS SES](#configuração-aws-ses)
4. [Configuração Gmail](#configuração-gmail)
5. [Configuração do Supabase](#configuração-do-supabase)
6. [Testes](#testes)
7. [Troubleshooting](#troubleshooting)
8. [Custos](#custos)

## 🎯 Visão Geral

O MedAssist precisa enviar emails para:
- ✅ Confirmação de cadastro de usuários
- 🔑 Recuperação de senha
- 📋 Notificações de relatórios médicos
- 📊 Alertas do sistema

### Provedores Recomendados

| Provedor | Facilidade | Custo | Confiabilidade | Recomendado para |
|----------|------------|-------|----------------|------------------|
| **SendGrid** | ⭐⭐⭐⭐⭐ | 💰💰 | ⭐⭐⭐⭐⭐ | Produção |
| **AWS SES** | ⭐⭐⭐ | 💰 | ⭐⭐⭐⭐⭐ | Produção (AWS) |
| **Gmail** | ⭐⭐⭐⭐ | 💰 | ⭐⭐⭐ | Desenvolvimento |

## 🚀 Configuração SendGrid

### Passo 1: Criar Conta SendGrid

1. Acesse [SendGrid](https://sendgrid.com/)
2. Crie uma conta gratuita (100 emails/dia)
3. Verifique seu email

### Passo 2: Gerar API Key

1. Faça login no SendGrid
2. Vá em **Settings** → **API Keys**
3. Clique em **Create API Key**
4. Escolha **Full Access** ou **Restricted Access**
5. Para Restricted Access, habilite:
   - Mail Send
   - Template Engine
   - Stats
6. Copie a API Key (começa com `SG.`)

### Passo 3: Verificar Domínio (Opcional)

1. Vá em **Settings** → **Sender Authentication**
2. Clique em **Authenticate Your Domain**
3. Siga as instruções para adicionar registros DNS
4. Aguarde verificação (pode levar até 48h)

### Passo 4: Configurar no Projeto

```bash
# No arquivo .env
SENDGRID_API_KEY=SG.sua_api_key_aqui
SMTP_FROM_EMAIL=admin@seudominio.com
SMTP_FROM_NAME=MedAssist
```

### Passo 5: Atualizar config.toml do Supabase

```toml
[auth.email.smtp]
enabled = true
host = "smtp.sendgrid.net"
port = 587
user = "apikey"
pass = "env(SENDGRID_API_KEY)"
admin_email = "admin@seudominio.com"
max_frequency = "1s"
```

## ☁️ Configuração AWS SES

### Passo 1: Configurar AWS SES

1. Acesse o [Console AWS](https://console.aws.amazon.com/)
2. Vá para **Simple Email Service (SES)**
3. Escolha uma região (ex: us-east-1)
4. Verifique seu email ou domínio

### Passo 2: Sair do Sandbox

1. No SES, vá em **Sending statistics**
2. Clique em **Request production access**
3. Preencha o formulário explicando o uso
4. Aguarde aprovação (1-2 dias úteis)

### Passo 3: Criar Credenciais SMTP

1. No SES, vá em **SMTP settings**
2. Clique em **Create SMTP credentials**
3. Anote o **SMTP username** e **SMTP password**

### Passo 4: Configurar no Projeto

```bash
# No arquivo .env
AWS_ACCESS_KEY_ID=seu_smtp_username
AWS_SECRET_ACCESS_KEY=sua_smtp_password
AWS_REGION=us-east-1
SMTP_FROM_EMAIL=admin@seudominio.com
```

### Passo 5: Atualizar config.toml

```toml
[auth.email.smtp]
enabled = true
host = "email-smtp.us-east-1.amazonaws.com"
port = 587
user = "env(AWS_ACCESS_KEY_ID)"
pass = "env(AWS_SECRET_ACCESS_KEY)"
admin_email = "admin@seudominio.com"
```

## 📧 Configuração Gmail

> ⚠️ **Aviso**: Gmail é recomendado apenas para desenvolvimento/testes

### Passo 1: Ativar 2FA

1. Vá em [Conta Google](https://myaccount.google.com/)
2. **Segurança** → **Verificação em duas etapas**
3. Ative a verificação em duas etapas

### Passo 2: Gerar Senha de App

1. Em **Segurança** → **Senhas de app**
2. Selecione **Email** e **Outro**
3. Digite "MedAssist" como nome
4. Copie a senha gerada (16 caracteres)

### Passo 3: Configurar no Projeto

```bash
# No arquivo .env
GMAIL_USER=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_senha_de_app
SMTP_FROM_EMAIL=seu_email@gmail.com
```

### Passo 4: Atualizar config.toml

```toml
[auth.email.smtp]
enabled = true
host = "smtp.gmail.com"
port = 587
user = "env(GMAIL_USER)"
pass = "env(GMAIL_APP_PASSWORD)"
admin_email = "seu_email@gmail.com"
```

## ⚙️ Configuração do Supabase

### Desenvolvimento Local

1. **Copie o arquivo de exemplo**:
   ```bash
   cp .env.example .env
   ```

2. **Preencha as variáveis**:
   ```bash
   # Escolha um provedor e preencha as credenciais
   SENDGRID_API_KEY=SG.sua_api_key
   SMTP_FROM_EMAIL=admin@medassist.com
   TEST_EMAIL=seu_email@gmail.com
   ```

3. **Atualize o config.toml**:
   ```bash
   # Edite supabase/config.toml
   [auth.email.smtp]
   enabled = true
   # ... configurações do provedor escolhido
   ```

4. **Reinicie o Supabase**:
   ```bash
   supabase stop
   supabase start
   ```

### Produção

1. **Configure variáveis no Supabase Dashboard**:
   - Vá em **Settings** → **Environment variables**
   - Adicione as variáveis de ambiente

2. **Atualize configurações de Auth**:
   - **Settings** → **Authentication** → **SMTP settings**
   - Configure o provedor escolhido

## 🧪 Testes

### Teste Rápido de Conexão

```bash
# Instalar dependências
npm install nodemailer dotenv

# Executar teste
node test_sendgrid_smtp.js
```

### Teste de Cadastro Completo

```bash
# Testar fluxo completo de cadastro
node test_supabase_email_flow.js
```

### Verificar Logs

```bash
# Logs do Supabase Auth
docker logs supabase_auth_doctor-brief-ai-premium-1 --tail 50

# Logs gerais
supabase logs
```

## 🔧 Troubleshooting

### Erro: "Authentication failed"

**Causa**: Credenciais incorretas

**Solução**:
1. Verifique se a API Key está correta
2. Para SendGrid, use `apikey` como usuário
3. Para AWS SES, use as credenciais SMTP específicas

### Erro: "Connection refused"

**Causa**: Host ou porta incorretos

**Solução**:
1. Verifique o host SMTP do provedor
2. Use porta 587 (TLS) ou 465 (SSL)
3. Verifique firewall/proxy

### Erro: "Rate limit exceeded"

**Causa**: Muitos emails enviados

**Solução**:
1. Aguarde o reset do limite
2. Upgrade do plano do provedor
3. Implemente rate limiting na aplicação

### Emails não chegam

**Possíveis causas**:
1. **Spam**: Verifique pasta de spam
2. **Domínio não verificado**: Verifique domínio no provedor
3. **Reputação**: Use domínio próprio verificado

**Soluções**:
1. Configure SPF, DKIM e DMARC
2. Use domínio verificado
3. Monitore reputação do IP

### Erro: "Template not found"

**Causa**: Templates HTML não encontrados

**Solução**:
1. Verifique se os arquivos estão em `supabase/templates/`
2. Reinicie o Supabase após adicionar templates
3. Verifique permissões dos arquivos

## 💰 Custos

### SendGrid
- **Gratuito**: 100 emails/dia
- **Essentials**: $14.95/mês (40.000 emails)
- **Pro**: $89.95/mês (100.000 emails)

### AWS SES
- **Gratuito**: 62.000 emails/mês (se hospedado na AWS)
- **Pago**: $0.10 por 1.000 emails
- **Sem hospedagem AWS**: $0.10 por 1.000 emails (sem tier gratuito)

### Gmail
- **Gratuito**: Limitado (não recomendado para produção)
- **Google Workspace**: $6/usuário/mês

## 📚 Recursos Adicionais

- [Documentação SendGrid](https://docs.sendgrid.com/)
- [Documentação AWS SES](https://docs.aws.amazon.com/ses/)
- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Boas práticas de email](https://sendgrid.com/blog/email-best-practices/)

## 🔒 Segurança

### Boas Práticas

1. **Nunca commite credenciais**
2. **Use variáveis de ambiente**
3. **Rotacione API keys regularmente**
4. **Configure SPF/DKIM/DMARC**
5. **Monitore logs de email**
6. **Use HTTPS sempre**
7. **Valide emails antes de enviar**

### Compliance

- **LGPD**: Obtenha consentimento para emails
- **HIPAA**: Use provedores compatíveis
- **CAN-SPAM**: Inclua link de descadastro
- **GDPR**: Respeite direitos de privacidade

---

**📞 Suporte**: Se encontrar problemas, verifique os logs e consulte a documentação do provedor escolhido.