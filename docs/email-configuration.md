# Configuração de Email - MedAssist

## Resumo do Problema Identificado

Durante o desenvolvimento, identificamos que o Supabase local tem dificuldades para se conectar com o Mailpit (substituto do Inbucket) para envio de emails de confirmação. O problema está relacionado à configuração de rede entre containers Docker.

## Status Atual

✅ **Funcionando**: Cadastro de usuários sem confirmação de email  
❌ **Problema**: Envio de emails de confirmação via SMTP local  
🔄 **Necessário**: Configuração de SMTP para produção

## Configurações por Ambiente

### 1. Desenvolvimento Local (Atual)

**Arquivo**: `supabase/config.toml`

```toml
# SMTP desabilitado para desenvolvimento
[auth.email.smtp]
enabled = false
host = "supabase_inbucket_doctor-brief-ai-premium-1"
port = 1025
user = "mailpit"
pass = "mailpit"
admin_email = "admin@localhost"
sender_name = "MedAssist"
```

**Comportamento**:

- Usuários são criados sem confirmação de email
- Ideal para desenvolvimento e testes
- Não requer configuração de SMTP externa

### 2. Produção (Recomendado)

#### Opção A: SendGrid

```toml
[auth.email.smtp]
enabled = true
host = "smtp.sendgrid.net"
port = 587
user = "apikey"
pass = "SG.sua_api_key_aqui"
admin_email = "admin@medassist.com"
sender_name = "MedAssist"
```

#### Opção B: AWS SES

```toml
[auth.email.smtp]
enabled = true
host = "email-smtp.us-east-1.amazonaws.com"
port = 587
user = "sua_access_key_id"
pass = "sua_secret_access_key"
admin_email = "admin@medassist.com"
sender_name = "MedAssist"
```

#### Opção C: Gmail (Para testes)

```toml
[auth.email.smtp]
enabled = true
host = "smtp.gmail.com"
port = 587
user = "seu_email@gmail.com"
pass = "sua_senha_de_app"
admin_email = "seu_email@gmail.com"
sender_name = "MedAssist"
```

### 3. Staging/Homologação

```toml
[auth.email.smtp]
enabled = true
host = "smtp.mailtrap.io"
port = 2525
user = "seu_usuario_mailtrap"
pass = "sua_senha_mailtrap"
admin_email = "admin@staging.medassist.com"
sender_name = "MedAssist - Staging"
```

## Variáveis de Ambiente

Para maior segurança, use variáveis de ambiente em produção:

```bash
# .env.production
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.sua_api_key_aqui
SMTP_ADMIN_EMAIL=admin@medassist.com
SMTP_SENDER_NAME=MedAssist
```

## Templates de Email

O Supabase permite personalizar os templates de email:

### Confirmação de Cadastro

```html
<h2>Bem-vindo ao MedAssist!</h2>
<p>Olá {{ .Name }},</p>
<p>Clique no link abaixo para confirmar seu email:</p>
<a href="{{ .ConfirmationURL }}">Confirmar Email</a>
```

### Recuperação de Senha

```html
<h2>Recuperação de Senha - MedAssist</h2>
<p>Olá {{ .Name }},</p>
<p>Clique no link abaixo para redefinir sua senha:</p>
<a href="{{ .ResetURL }}">Redefinir Senha</a>
```

## Troubleshooting

### Problema: "Error sending confirmation email"

**Possíveis causas**:

1. Configurações SMTP incorretas
2. Credenciais inválidas
3. Problemas de rede/firewall
4. Limite de envio atingido

**Soluções**:

1. Verificar logs do container auth: `docker logs supabase_auth_doctor-brief-ai-premium-1`
2. Testar conexão SMTP manualmente
3. Verificar se o provedor SMTP está funcionando
4. Temporariamente desabilitar SMTP para desenvolvimento

### Problema: Emails não chegam

**Verificações**:

1. Pasta de spam/lixo eletrônico
2. Configuração SPF/DKIM do domínio
3. Reputação do IP do provedor SMTP
4. Logs do provedor SMTP

## Próximos Passos

1. **Escolher provedor SMTP** para produção (recomendado: SendGrid)
2. **Configurar domínio** com registros SPF/DKIM
3. **Criar templates** personalizados de email
4. **Implementar monitoramento** de entrega de emails
5. **Configurar rate limiting** para evitar spam

## Custos Estimados

- **SendGrid**: Gratuito até 100 emails/dia, depois $14.95/mês
- **AWS SES**: $0.10 por 1.000 emails
- **Mailtrap**: Gratuito para desenvolvimento, $10/mês para produção
- **Gmail**: Gratuito (limitado), não recomendado para produção

## Segurança

⚠️ **Importante**:

- Nunca commitar credenciais SMTP no código
- Usar variáveis de ambiente em produção
- Rotacionar chaves de API regularmente
- Monitorar uso para detectar abusos
- Implementar rate limiting no frontend

---

**Última atualização**: Janeiro 2025  
**Status**: Configuração de desenvolvimento funcional, produção pendente
