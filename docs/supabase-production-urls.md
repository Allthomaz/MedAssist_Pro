# Configuração de URLs de Produção no Supabase

## 📋 Guia Completo para Configurar URLs de Redirecionamento

### 🎯 Objetivo

Configurar corretamente as URLs de redirecionamento no Dashboard do Supabase para o ambiente de produção do MedAssist.

---

## 🚀 Passo a Passo

### 1. Acesso ao Dashboard

1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **MedAssist**

### 2. Navegação para Configuração de URLs

1. No menu lateral, clique em **Authentication**
2. Selecione **URL Configuration**

### 3. URLs Obrigatórias para Configurar

#### Site URL (URL Principal)

```
https://medassist.com
```

#### Additional Redirect URLs (URLs de Redirecionamento)

Adicione as seguintes URLs uma por linha:

```
https://medassist.com/auth/callback
https://medassist.com/auth/confirm
https://medassist.com/reset-password
https://medassist.com/
https://www.medassist.com
https://www.medassist.com/auth/callback
https://www.medassist.com/auth/confirm
https://www.medassist.com/reset-password
```

---

## 🔧 Configurações Específicas por Ambiente

### Produção (Vercel)

- **Domínio Principal**: `https://medassist.com`
- **Domínio com WWW**: `https://www.medassist.com`
- **Preview URLs**: `https://*.vercel.app` (opcional para testes)

### Desenvolvimento Local

- **URL Local**: `http://127.0.0.1:3000`
- **Callback Local**: `http://127.0.0.1:3000/auth/callback`

---

## ⚠️ Pontos Importantes

### Segurança

- ✅ **SEMPRE** use HTTPS em produção
- ✅ **NUNCA** adicione URLs de desenvolvimento em produção
- ✅ Mantenha a lista de URLs mínima e específica

### Formato das URLs

- ✅ Inclua protocolo (https://)
- ✅ Não adicione barra final desnecessária
- ✅ Use domínios exatos (sem wildcards em produção)

### Validação

- ✅ Teste cada URL após configurar
- ✅ Verifique login/logout funcionando
- ✅ Confirme reset de senha operacional

---

## 🧪 Como Testar

### 1. Teste de Login

1. Acesse `https://medassist.com`
2. Clique em "Entrar"
3. Faça login com suas credenciais
4. Verifique se é redirecionado corretamente

### 2. Teste de Reset de Senha

1. Na tela de login, clique em "Esqueci minha senha"
2. Digite seu email
3. Verifique se recebe o email
4. Clique no link do email
5. Confirme se é redirecionado para a página correta

### 3. Teste de Logout

1. Faça logout da aplicação
2. Verifique se é redirecionado para a página inicial

---

## 🔍 Troubleshooting

### Erro: "Invalid Redirect URL"

**Causa**: URL não está na lista de URLs permitidas
**Solução**: Adicione a URL exata na configuração

### Erro: "CORS Error"

**Causa**: Configuração de domínio incorreta
**Solução**: Verifique se o domínio está correto e usando HTTPS

### Login não funciona

**Causa**: Site URL incorreta
**Solução**: Confirme que a Site URL principal está correta

---

## 📝 Checklist Final

- [ ] Site URL configurada: `https://medassist.com`
- [ ] URLs de callback adicionadas
- [ ] URLs de confirmação adicionadas
- [ ] URLs de reset de senha adicionadas
- [ ] Versões com e sem WWW incluídas
- [ ] Teste de login realizado
- [ ] Teste de logout realizado
- [ ] Teste de reset de senha realizado
- [ ] Todas as funcionalidades de auth funcionando

---

## 🚨 Lembrete de Segurança

> **IMPORTANTE**: Mantenha apenas as URLs necessárias na lista. URLs desnecessárias podem representar riscos de segurança.

> **ATENÇÃO**: Sempre use HTTPS em produção. HTTP só deve ser usado em desenvolvimento local.

---

_Documento criado para o projeto MedAssist - Versão 1.0_
