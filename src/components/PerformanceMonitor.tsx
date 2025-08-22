import React, { useEffect, useRef, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface PerformanceMonitorProps {
  children: ReactNode;
  name: string;
  op?: string;
  description?: string;
  tags?: Record<string, string>;
  data?: Record<string, any>;
}

/**
 * Component para monitorar performance de componentes React com Sentry
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  children,
  name,
  op = 'ui.react.render',
  description,
  tags = {},
  data = {},
}) => {
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Adiciona breadcrumb para rastrear renderização do componente
    Sentry.addBreadcrumb({
      message: `Component ${name} rendered`,
      category: 'ui.react',
      level: 'info',
      data: {
        component: name,
        renderTime: Date.now() - startTimeRef.current,
        ...tags,
        ...data,
      },
    });
    startTimeRef.current = Date.now();

    // Cleanup: adiciona breadcrumb quando o componente é desmontado
    return () => {
      const renderTime = Date.now() - startTimeRef.current;
      Sentry.addBreadcrumb({
        message: `Component ${name} unmounted`,
        category: 'ui.react',
        level: 'info',
        data: {
          component: name,
          totalRenderTime: renderTime,
          lifecycle: 'unmount',
        },
      });
    };
  }, [name, op, description]);

  // Monitora re-renders
  useEffect(() => {
    if (transactionRef.current) {
      const span = transactionRef.current.startChild({
        op: 'ui.react.rerender',
        description: `Re-render of ${name}`,
      });

      span.finish();
    }
  });

  return <>{children}</>;
};

/**
 * Hook para monitorar operações assíncronas
 */
export const usePerformanceMonitor = () => {
  const startOperation = (name: string, op: string = 'custom.operation') => {
    const startTime = Date.now();
    return {
      finish: () => {
        const duration = Date.now() - startTime;
        Sentry.addBreadcrumb({
          message: `Operation ${name} completed`,
          category: 'performance',
          level: 'info',
          data: {
            operation: name,
            duration,
            op,
          },
        });
      },
    };
  };

  const measureAsync = async <T,>(
    name: string,
    operation: () => Promise<T>,
    options?: {
      op?: string;
      tags?: Record<string, string>;
      data?: Record<string, any>;
    }
  ): Promise<T> => {
    const startTime = Date.now();

    try {
      const result = await operation();
      const duration = Date.now() - startTime;

      Sentry.addBreadcrumb({
        message: `Async operation ${name} completed successfully`,
        category: 'performance',
        level: 'info',
        data: {
          operation: name,
          duration,
          status: 'success',
          op: options?.op || 'custom.async_operation',
          ...options?.tags,
          ...options?.data,
        },
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      Sentry.addBreadcrumb({
        message: `Async operation ${name} failed`,
        category: 'performance',
        level: 'error',
        data: {
          operation: name,
          duration,
          status: 'error',
          op: options?.op || 'custom.async_operation',
          ...options?.tags,
          ...options?.data,
        },
      });

      Sentry.captureException(error);
      throw error;
    }
  };

  const addBreadcrumb = (
    message: string,
    category: string = 'performance',
    level: Sentry.SeverityLevel = 'info'
  ) => {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      timestamp: Date.now() / 1000,
    });
  };

  return {
    startOperation,
    measureAsync,
    addBreadcrumb,
  };
};

/**
 * HOC para adicionar monitoramento de performance a qualquer componente
 */
export const withPerformanceMonitor = <P extends object>(
  Component: React.ComponentType<P>,
  monitorOptions: {
    name?: string;
    op?: string;
    description?: string;
    tags?: Record<string, string>;
  } = {}
) => {
  const WrappedComponent = (props: P) => {
    const componentName =
      monitorOptions.name ||
      Component.displayName ||
      Component.name ||
      'UnknownComponent';

    return (
      <PerformanceMonitor
        name={componentName}
        op={monitorOptions.op}
        description={monitorOptions.description}
        tags={monitorOptions.tags}
      >
        <Component {...props} />
      </PerformanceMonitor>
    );
  };

  WrappedComponent.displayName = `withPerformanceMonitor(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

/**
 * Hook para monitorar Web Vitals
 */
export const useWebVitals = () => {
  useEffect(() => {
    // Monitora Core Web Vitals se disponível
    if ('web-vitals' in window || typeof window !== 'undefined') {
      import('web-vitals')
        .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(metric => {
            Sentry.setMeasurement('cls', metric.value, 'ratio');
          });

          getFID(metric => {
            Sentry.setMeasurement('fid', metric.value, 'millisecond');
          });

          getFCP(metric => {
            Sentry.setMeasurement('fcp', metric.value, 'millisecond');
          });

          getLCP(metric => {
            Sentry.setMeasurement('lcp', metric.value, 'millisecond');
          });

          getTTFB(metric => {
            Sentry.setMeasurement('ttfb', metric.value, 'millisecond');
          });
        })
        .catch(() => {
          // web-vitals não disponível, continua sem erro
        });
    }
  }, []);
};

export default PerformanceMonitor;
