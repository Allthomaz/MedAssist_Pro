# Módulo de Autenticação

Este módulo gerencia toda a autenticação e autorização do sistema Doctor Brief AI, garantindo acesso seguro e controlado às funcionalidades médicas.

## Visão Geral

O módulo de autenticação é responsável por:

- Autenticação segura de usuários (médicos e pacientes)
- Gerenciamento de sessões e tokens
- Controle de acesso baseado em roles
- Integração com Supabase Auth
- Recuperação de senha e verificação de email
- Conformidade com LGPD/HIPAA

## Arquitetura de Segurança

### Fluxo de Autenticação

```
Login → Validação → Token JWT → Sessão →
Verificação de Role → Acesso Autorizado
```

### Níveis de Acesso

- **Admin**: Acesso total ao sistema
- **Médico**: Acesso a consultas, pacientes e relatórios
- **Paciente**: Acesso limitado aos próprios dados
- **Convidado**: Apenas páginas públicas

## Componentes Principais

### AuthContext.tsx

**Localização**: `src/contexts/AuthContext.tsx`
**Propósito**: Context Provider para gerenciamento global de autenticação.

**Estados Gerenciados**:

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (
    email: string,
    password: string,
    userData: UserMetadata
  ) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: UserMetadata) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  isAuthenticated: boolean;
}
```

**Funcionalidades**:

- ✅ Gerenciamento de estado de autenticação
- ✅ Persistência de sessão
- ✅ Refresh automático de tokens
- ✅ Logout automático por inatividade
- ✅ Verificação de roles em tempo real

### useAuth Hook

**Localização**: `src/hooks/useAuth.ts`
**Propósito**: Hook personalizado para acesso às funcionalidades de auth.

```typescript
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
};
```

**Funcionalidades**:

- ✅ Acesso tipado ao contexto de auth
- ✅ Validação de uso correto
- ✅ Helpers para verificações comuns

## Serviços de Autenticação

### authService

**Localização**: `src/services/auth.ts`

**Funcionalidades Principais**:

#### Autenticação

```typescript
// Login com email/senha
const signIn = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Validação de entrada
  // Chamada para Supabase Auth
  // Tratamento de erros específicos
  // Retorno padronizado
};

// Registro de novo usuário
const signUp = async (
  email: string,
  password: string,
  metadata: UserMetadata
): Promise<AuthResponse> => {
  // Validação de dados
  // Criação de conta no Supabase
  // Envio de email de confirmação
  // Criação de perfil de usuário
};
```

#### Gerenciamento de Sessão

```typescript
// Verificação de sessão ativa
const getCurrentSession = async (): Promise<Session | null> => {
  // Verificação de token válido
  // Refresh automático se necessário
  // Retorno de dados da sessão
};

// Logout seguro
const signOut = async (): Promise<void> => {
  // Invalidação de tokens
  // Limpeza de dados locais
  // Redirecionamento seguro
};
```

#### Recuperação de Senha

```typescript
// Solicitação de reset
const resetPassword = async (email: string): Promise<void> => {
  // Validação de email
  // Envio de link de recuperação
  // Log de segurança
};

// Atualização de senha
const updatePassword = async (
  newPassword: string,
  token: string
): Promise<void> => {
  // Validação de token
  // Verificação de força da senha
  // Atualização segura
};
```

## Estrutura de Dados

### User Interface

```typescript
interface User {
  id: string;
  email: string;
  email_confirmed_at?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  user_metadata: UserMetadata;
  app_metadata: AppMetadata;
}
```

### UserMetadata Interface

```typescript
interface UserMetadata {
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  crm?: string; // Para médicos
  specialty?: string; // Para médicos
  phone?: string;
  birth_date?: string;
  address?: Address;
  preferences?: UserPreferences;
}
```

### UserRole Enum

```typescript
enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
  GUEST = 'guest',
}
```

## Configuração de Segurança

### Supabase Auth Settings

```javascript
const supabaseConfig = {
  auth: {
    // Configurações de sessão
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,

    // Configurações de segurança
    flowType: 'pkce', // Proof Key for Code Exchange

    // Configurações de email
    confirmEmail: true,
    emailRedirectTo: `${window.location.origin}/auth/callback`,

    // Configurações de senha
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
  },
};
```

### Row Level Security (RLS)

```sql
-- Política para usuários acessarem apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para médicos acessarem dados de pacientes
CREATE POLICY "Doctors can view patient data" ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'doctor'
    )
  );

-- Política para admins
CREATE POLICY "Admins have full access" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

## Validações e Segurança

### Validação de Entrada

```typescript
// Schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter ao menos um número')
    .regex(/[^A-Za-z0-9]/, 'Deve conter ao menos um símbolo'),
  full_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  role: z.enum(['doctor', 'patient']),
  crm: z
    .string()
    .optional()
    .refine(val => {
      // Validação específica para CRM se role for doctor
    }),
});
```

### Proteção contra Ataques

#### Rate Limiting

```typescript
// Implementação de rate limiting para login
const loginAttempts = new Map<string, { count: number; lastAttempt: Date }>();

const checkRateLimit = (email: string): boolean => {
  const attempts = loginAttempts.get(email);
  const now = new Date();

  if (!attempts) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }

  // Reset contador após 15 minutos
  if (now.getTime() - attempts.lastAttempt.getTime() > 15 * 60 * 1000) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }

  // Máximo 5 tentativas por 15 minutos
  if (attempts.count >= 5) {
    return false;
  }

  attempts.count++;
  attempts.lastAttempt = now;
  return true;
};
```

#### Sanitização de Dados

```typescript
// Sanitização de inputs
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>"'&]/g, '') // Remove caracteres perigosos
    .substring(0, 255); // Limita tamanho
};

// Validação de email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};
```

## Tratamento de Erros

### Tipos de Erro

```typescript
enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  EMAIL_NOT_CONFIRMED = 'email_not_confirmed',
  USER_NOT_FOUND = 'user_not_found',
  WEAK_PASSWORD = 'weak_password',
  EMAIL_ALREADY_EXISTS = 'email_already_exists',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error',
}
```

### Mensagens de Erro Localizadas

```typescript
const errorMessages = {
  [AuthErrorType.INVALID_CREDENTIALS]: 'Email ou senha incorretos',
  [AuthErrorType.EMAIL_NOT_CONFIRMED]:
    'Confirme seu email antes de fazer login',
  [AuthErrorType.USER_NOT_FOUND]: 'Usuário não encontrado',
  [AuthErrorType.WEAK_PASSWORD]:
    'Senha muito fraca. Use pelo menos 8 caracteres com letras, números e símbolos',
  [AuthErrorType.EMAIL_ALREADY_EXISTS]: 'Este email já está cadastrado',
  [AuthErrorType.RATE_LIMIT_EXCEEDED]:
    'Muitas tentativas. Tente novamente em 15 minutos',
  [AuthErrorType.NETWORK_ERROR]: 'Erro de conexão. Verifique sua internet',
  [AuthErrorType.UNKNOWN_ERROR]: 'Erro inesperado. Tente novamente',
};
```

## Conformidade e Auditoria

### LGPD (Lei Geral de Proteção de Dados)

- ✅ Consentimento explícito para coleta de dados
- ✅ Direito ao esquecimento (exclusão de conta)
- ✅ Portabilidade de dados
- ✅ Notificação de vazamentos
- ✅ Minimização de dados coletados

### HIPAA (Health Insurance Portability and Accountability Act)

- ✅ Criptografia de dados em trânsito e repouso
- ✅ Controle de acesso baseado em roles
- ✅ Auditoria de acessos
- ✅ Backup seguro de dados
- ✅ Treinamento de usuários

### Logs de Auditoria

```typescript
interface AuditLog {
  id: string;
  user_id: string;
  action: AuditAction;
  resource: string;
  timestamp: Date;
  ip_address: string;
  user_agent: string;
  success: boolean;
  error_message?: string;
}

enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PASSWORD_RESET = 'password_reset',
  PROFILE_UPDATE = 'profile_update',
  DATA_ACCESS = 'data_access',
  DATA_EXPORT = 'data_export',
  ACCOUNT_DELETE = 'account_delete',
}
```

## Configuração do Ambiente

### Variáveis de Ambiente

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase

# Configurações de Auth
VITE_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback
VITE_AUTH_PASSWORD_MIN_LENGTH=8
VITE_AUTH_SESSION_TIMEOUT=3600

# Configurações de Email
VITE_EMAIL_FROM=noreply@doctorbriefai.com
VITE_EMAIL_SUPPORT=support@doctorbriefai.com

# Configurações de Segurança
VITE_RATE_LIMIT_LOGIN=5
VITE_RATE_LIMIT_WINDOW=900000
```

### Configuração do Supabase

#### Tabelas Necessárias

```sql
-- Tabela de perfis de usuário
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'patient')),
  crm TEXT,
  specialty TEXT,
  phone TEXT,
  birth_date DATE,
  address JSONB,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de auditoria
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  error_message TEXT
);

-- Índices para performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
```

#### Triggers para Auditoria

```sql
-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();
```

## Uso Prático

### Exemplo: Configuração do Provider

```tsx
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### Exemplo: Componente de Login

```tsx
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

function LoginForm() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signIn(email, password);
      // Redirecionamento será feito automaticamente
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
```

### Exemplo: Rota Protegida

```tsx
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
```

## Testes

### Testes de Integração

```typescript
// Teste de login
describe('Authentication', () => {
  test('should login with valid credentials', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });

    expect(result.current.user).toBeTruthy();
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('should reject invalid credentials', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await expect(
      result.current.signIn('invalid@example.com', 'wrongpassword')
    ).rejects.toThrow('Invalid credentials');
  });
});
```

## Monitoramento

### Métricas de Segurança

- Taxa de tentativas de login falhadas
- Tempo médio de sessão
- Frequência de reset de senha
- Acessos por role
- Tentativas de acesso não autorizado

### Alertas de Segurança

- Múltiplas tentativas de login falhadas
- Login de localização incomum
- Acesso a dados sensíveis
- Alterações de perfil críticas
- Tentativas de escalação de privilégios

## Roadmap

### Próximas Funcionalidades

- [ ] Autenticação de dois fatores (2FA)
- [ ] Login social (Google, Microsoft)
- [ ] Biometria (quando disponível)
- [ ] Single Sign-On (SSO)
- [ ] Certificado digital A1/A3

### Melhorias de Segurança

- [ ] Detecção de anomalias comportamentais
- [ ] Criptografia de ponta a ponta
- [ ] Backup automático de dados críticos
- [ ] Compliance com ISO 27001
- [ ] Auditoria externa de segurança

## Contribuição

Para contribuir com este módulo:

1. **Segurança First**: Toda mudança deve ser avaliada por impacto de segurança
2. **Testes Obrigatórios**: Cobertura mínima de 90% para código de auth
3. **Documentação**: Atualize este README para novas funcionalidades
4. **Auditoria**: Registre todas as operações críticas
5. **Compliance**: Mantenha conformidade com LGPD/HIPAA

## Suporte

Para problemas de autenticação:

1. Verifique os logs de auditoria
2. Confirme configurações do Supabase
3. Teste conectividade de rede
4. Valide variáveis de ambiente
5. Consulte documentação do Supabase Auth

### Contatos de Emergência

- **Segurança**: security@doctorbriefai.com
- **Suporte Técnico**: support@doctorbriefai.com
- **Compliance**: compliance@doctorbriefai.com
