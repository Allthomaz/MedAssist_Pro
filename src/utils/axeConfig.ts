import React from 'react';

/**
 * Configuração do @axe-core/react para auditoria de acessibilidade
 *
 * Este arquivo configura a ferramenta de auditoria de acessibilidade
 * que executa automaticamente em desenvolvimento e reporta problemas
 * no console do navegador.
 */

// Inicialização do axe-core (apenas em desenvolvimento)
export const initializeAxe = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const axe = await import('@axe-core/react');
      const ReactDOM = await import('react-dom');

      // Inicializa o axe-core com configurações personalizadas
      axe.default(React, ReactDOM, 1000, {
        rules: {
          'color-contrast': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'focus-management': { enabled: true },
        },
        tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      });

      console.log('🔍 Axe-core inicializado para auditoria de acessibilidade');
    } catch (error) {
      console.warn('⚠️ Erro ao inicializar axe-core:', error);
    }
  }
};

/**
 * Função para executar auditoria manual de acessibilidade
 */
export const runAccessibilityAudit = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn(
      'Auditoria de acessibilidade disponível apenas em desenvolvimento'
    );
    return;
  }

  try {
    const axeCore = await import('axe-core');

    const results = await axeCore.default.run(document, {
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
      },
    });

    if (results.violations.length === 0) {
      console.log('✅ Nenhuma violação de acessibilidade encontrada!');
    } else {
      console.group('🚨 Violações de Acessibilidade Encontradas:');
      results.violations.forEach((violation, index) => {
        console.group(`${index + 1}. ${violation.description}`);
        console.log('Impacto:', violation.impact);
        console.log('Ajuda:', violation.helpUrl);
        console.log('Elementos afetados:', violation.nodes.length);
        violation.nodes.forEach((node, nodeIndex) => {
          console.log(`  Elemento ${nodeIndex + 1}:`, node.target);
          console.log('  HTML:', node.html);
        });
        console.groupEnd();
      });
      console.groupEnd();
    }

    if (results.passes.length > 0) {
      console.group('✅ Verificações de Acessibilidade que Passaram:');
      results.passes.forEach(pass => {
        console.log(`✓ ${pass.description} (${pass.nodes.length} elementos)`);
      });
      console.groupEnd();
    }
  } catch (error) {
    console.error('❌ Erro durante auditoria de acessibilidade:', error);
  }
};

/**
 * Configurações padrão para o axe-core
 */
export const axeConfig = {
  rules: {
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-management': { enabled: true },
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
};

/**
 * Exemplo de uso:
 *
 * import { initializeAxe, runAccessibilityAudit } from './utils/axeConfig';
 *
 * // No main.tsx ou App.tsx
 * initializeAxe();
 *
 * // Para auditoria manual
 * runAccessibilityAudit();
 */
