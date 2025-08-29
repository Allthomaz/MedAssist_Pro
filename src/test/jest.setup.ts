import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { configure } from '@testing-library/react';
import './vite-env.d.ts';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Configurar React Testing Library
configure({
  testIdAttribute: 'data-testid',
});

// Mock do ResizeObserver para testes
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock do IntersectionObserver para testes
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock do matchMedia para testes
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do scrollTo para testes
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Configurar timeout para testes
jest.setTimeout(10000);

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});
