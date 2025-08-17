import { Theme } from '../types';

export const THEMES: Record<string, Theme> = {
  light: {
    name: 'light',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
    },
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#3b82f6',
      secondary: '#94a3b8',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      error: '#f87171',
      success: '#4ade80',
      warning: '#fbbf24',
    },
  },
};

export const CALCULATOR_BUTTONS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '=', ''],
];

export const CALCULATOR_TYPES = [
  { id: 'basic', name: 'Basic Calculator', icon: '🧮' },
  { id: 'mortgage', name: 'Mortgage Calculator', icon: '🏠' },
  { id: 'loan', name: 'Loan Calculator', icon: '💰' },
  { id: 'investment', name: 'Investment Calculator', icon: '📈' },
  { id: 'savings', name: 'Savings Calculator', icon: '💎' },
];

export const MONTHS_IN_YEAR = 12;
export const DAYS_IN_YEAR = 365;
export const PERCENTAGE_MULTIPLIER = 100;
