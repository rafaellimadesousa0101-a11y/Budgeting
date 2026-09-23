import { Transaction } from '../types.ts';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const parseCurrencyInput = (input: string): number => {
  if (!input) return NaN;
  const isNegative = input.trim().startsWith('-');
  const clean = input.replace(/[^0-9.,]/g, '');
  if (!clean) return NaN;

  let val = 0;
  if (clean.includes('.') && clean.includes(',')) {
    if (clean.lastIndexOf(',') > clean.lastIndexOf('.')) {
      // Brazilian format: 1.250,50
      val = parseFloat(clean.replace(/\./g, '').replace(',', '.'));
    } else {
      // US format: 1,250.50
      val = parseFloat(clean.replace(/,/g, ''));
    }
  } else if (clean.includes(',')) {
    // Format: 1250,50
    val = parseFloat(clean.replace(',', '.'));
  } else {
    // Format: 1250.50 or 1250
    val = parseFloat(clean);
  }

  if (isNaN(val)) return NaN;
  return isNegative ? -Math.abs(val) : val;
};

export const formatDate = (dateStr: string): string => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    // Check if today or yesterday
    const today = new Date();
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month - 1 &&
      today.getDate() === day;

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday =
      yesterday.getFullYear() === year &&
      yesterday.getMonth() === month - 1 &&
      yesterday.getDate() === day;

    if (isToday) return 'Hoje';
    if (isYesterday) return 'Ontem';

    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const formatFullDate = (dateStr: string): string => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const formatMonthYear = (yearMonth: string): string => {
  try {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const formatted = new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return yearMonth;
  }
};

export const formatDeadlineMonthYear = (dateStr: string): string => {
  try {
    const parts = dateStr.split('-').map(Number);
    const year = parts[0];
    const month = parts[1];
    const months = [
      'Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.',
      'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'
    ];
    if (month >= 1 && month <= 12 && year) {
      return `${months[month - 1]}/${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

export const formatShortMonthYear = (yearMonth: string): string => {
  try {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const monthShort = new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
    }).format(date).replace('.', '');
    const capitalized = monthShort.charAt(0).toUpperCase() + monthShort.slice(1);
    return `${capitalized}. de ${year}`;
  } catch {
    return yearMonth;
  }
};

export const getTodayString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getCurrentMonthString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getInitialTransactions = (): Transaction[] => {
  return [];
};
