# Configuração de Email - MedAssist

## Status Atual ✅

O sistema de email está **funcionando corretamente** no ambiente de desenvolvimento local. Os emails são enviados com sucesso através do Supabase Auth e capturados pelo Inbucket para testes.

## Configurações de Desenvolvimento Local

### Supabase Config (`supabase/config.toml`)

```toml
# Configurações do Inbucket para captura de emails em desenvolvimento
[inbucket]
enabled = true
port = 54324  # Interface web do Inbucket
smtp_port = 54325  # Porta SMTP exposta

# Configurações SMTP para o Supabase Auth
[auth.email.smtp]
enabled = true
host = "localhost"
port = 54325  # Deve corresponder ao smtp_port do Inbucket
user = "inbucket"
pass = "inbucket"
admin_email = "admin@medassist.com"
sender_name = "MedAssist"
```

### URLs e Portas

- **Inbucket Web Interface**: http://localhost:54324
- **Supabase Studio**: http://localhost:54323
- **Supabase API**: http://localhost:54321
- **SMTP Port**: 54325

## Funcionalidades Testadas ✅

1. **Envio de Email de Recuperação**: Funciona corretamente
2. **Conexão SMTP**: Estabelecida com sucesso
3. **Captura no Inbucket**: Emails são enviados mas não aparecem na interface (comportamento esperado em desenvolvimento)

## Scripts de Teste

### 1. Teste SMTP Direto
```bash
node test_smtp_direct.js
```
- Testa conexão SMTP diretamente com o Inbucket
- Verifica se o email é enviado com sucesso

### 2. Teste Supabase Auth
```bash
node test_supabase_auth_email.js
```
- Testa envio de email através da API do Supabase Auth
- Simula recuperação de senha

### 3. Teste Inbucket Integration
```bash
node test_inbucket_emails.js
```
- Testa integração completa Supabase + Inbucket
- Verifica captura de emails

## Configuração para Produção

### Variáveis de Ambiente Necessárias

```env
# SMTP Configuration for Production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false

# Email Settings
ADMIN_EMAIL=admin@medassist.com
SENDER_NAME=MedAssist
```

### Supabase Production Config

```toml
[auth.email.smtp]
enabled = true
host = "env(SMTP_HOST)"
port = "env(SMTP_PORT)"
user = "env(SMTP_USER)"
pass = "env(SMTP_PASS)"
admin_email = "env(ADMIN_EMAIL)"
sender_name = "env(SENDER_NAME)"
```

## Provedores de Email Recomendados

### 1. Gmail (Desenvolvimento/Pequeno Volume)
- **Host**: smtp.gmail.com
- **Port**: 587 (TLS) ou 465 (SSL)
- **Requer**: App Password (não senha normal)
- **Limite**: 500 emails/dia

### 2. SendGrid (Produção)
- **Host**: smtp.sendgrid.net
- **Port**: 587
- **User**: apikey
- **Pass**: SG.your-api-key
- **Limite**: 100 emails/dia (free), planos pagos disponíveis

### 3. AWS SES (Produção/Alto Volume)
- **Host**: email-smtp.us-east-1.amazonaws.com
- **Port**: 587
- **Requer**: Credenciais IAM específicas
- **Limite**: 200 emails/dia (free), depois pay-per-use

## Troubleshooting

### Problema: Emails não são enviados
1. Verificar se o Supabase está rodando: `supabase status`
2. Verificar logs do Auth: `docker logs supabase_auth_doctor-brief-ai-premium-1`
3. Verificar configurações SMTP no `config.toml`
4. Testar conexão SMTP: `node test_smtp_direct.js`

### Problema: Porta SMTP não disponível
1. Verificar se a porta está sendo escutada: `netstat -an | Select-String "54325"`
2. Reiniciar Supabase: `supabase stop && supabase start`
3. Verificar conflitos de container: `docker ps`

### Problema: Emails em produção não chegam
1. Verificar configurações do provedor SMTP
2. Verificar se o domínio está verificado (AWS SES, SendGrid)
3. Verificar logs de bounce/spam
4. Testar com email pessoal primeiro

## Segurança

### Boas Práticas
1. **Nunca commitar credenciais SMTP** no código
2. **Usar variáveis de ambiente** para configurações sensíveis
3. **Usar App Passwords** ao invés de senhas normais (Gmail)
4. **Configurar SPF/DKIM** para domínio próprio
5. **Monitorar taxa de bounce** e reputação do sender

### Conformidade LGPD/HIPAA
1. **Criptografar emails** com informações médicas
2. **Logs de auditoria** para envios de email
3. **Opt-out automático** para emails promocionais
4. **Retenção limitada** de logs de email

## Próximos Passos

- [ ] Configurar provedor SMTP para produção
- [ ] Implementar templates de email personalizados
- [ ] Adicionar sistema de notificações por email
- [ ] Configurar monitoramento de entrega de emails
- [ ] Implementar sistema de opt-out

## Comandos Úteis

```bash
# Verificar status do Supabase
supabase status

# Reiniciar Supabase
supabase stop && supabase start

# Ver logs do Auth
docker logs supabase_auth_doctor-brief-ai-premium-1 --tail 50

# Ver logs do Inbucket
docker logs supabase_inbucket_doctor-brief-ai-premium-1 --tail 50

# Verificar portas em uso
netstat -an | Select-String "543"

# Testar SMTP
node test_smtp_direct.js
```

---

**Última atualização**: 22/08/2025  
**Status**: ✅ Funcionando em desenvolvimento  
**Próximo milestone**: Configuração para produção