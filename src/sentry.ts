import * as Sentry from '@sentry/react';

// Configuração robusta do Sentry para monitoramento de produção
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,

  // Integrações essenciais
  integrations: [
    // Performance monitoring
    Sentry.browserTracingIntegration({
      // Captura interações do usuário
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/.*\.vercel\.app/,
        /^https:\/\/medassist/,
      ],
    }),

    // Session Replay para debugging visual
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
      maskAllInputs: true, // Protege dados sensíveis em inputs
    }),

    // Feedback do usuário
    Sentry.feedbackIntegration({
      colorScheme: 'auto',
      showBranding: false,
    }),
  ],

  // Configurações de ambiente
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Performance Monitoring
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  // Configurações de contexto
  beforeSend(event, hint) {
    // Filtra erros conhecidos e não críticos
    const error = hint.originalException;

    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message).toLowerCase();

      // Ignora erros de rede comuns
      if (
        message.includes('network error') ||
        message.includes('fetch') ||
        message.includes('loading chunk') ||
        message.includes('script error')
      ) {
        return null;
      }
    }

    return event;
  },

  // Tags globais para categorização
  initialScope: {
    tags: {
      component: 'medassist-frontend',
      framework: 'react',
    },
  },
});

// Configuração de contexto do usuário
export const setSentryUser = (user: {
  id: string;
  email?: string;
  role?: string;
}) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  });
};

// Limpa contexto do usuário no logout
export const clearSentryUser = () => {
  Sentry.setUser(null);
};

// Captura erro customizado com contexto
export const captureErrorWithContext = (
  error: Error,
  context: Record<string, unknown>
) => {
  Sentry.withScope(scope => {
    Object.entries(context).forEach(([key, value]) => {
      scope.setContext(key, value);
    });
    Sentry.captureException(error);
  });
};

// Adiciona breadcrumb customizado
export const addBreadcrumb = (
  message: string,
  category: string,
  level: 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, unknown>
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
};
