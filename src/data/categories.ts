import { Category } from '../types.ts';

export const CATEGORIES: Category[] = [
  // Despesas
  { id: 'alimentacao', label: 'Alimentação', type: 'expense', icon: 'Utensils' },
  { id: 'moradia', label: 'Coisas de Casa', type: 'expense', icon: 'Home' },
  { id: 'transporte', label: 'Transporte', type: 'expense', icon: 'Car' },
  { id: 'compras', label: 'Compras', type: 'expense', icon: 'ShoppingBag' },
  { id: 'servicos', label: 'Contas & Serviços', type: 'expense', icon: 'Receipt' },
  { id: 'lazer', label: 'Lazer', type: 'expense', icon: 'Coffee' },
  { id: 'saude', label: 'Saúde', type: 'expense', icon: 'HeartPulse' },
  { id: 'educacao', label: 'Educação', type: 'expense', icon: 'BookOpen' },

  // Entradas
  { id: 'salario', label: 'Salário', type: 'income', icon: 'Briefcase' },
  { id: 'freelance', label: 'Freelance', type: 'income', icon: 'Laptop' },
  { id: 'investimentos', label: 'Investimentos', type: 'income', icon: 'TrendingUp' },

  // Geral
  { id: 'outros', label: 'Outros', type: 'both', icon: 'Tag' },
];

export const getCategoryById = (id: string): Category => {
  return CATEGORIES.find((cat) => cat.id === id) || {
    id: 'outros',
    label: 'Outros',
    type: 'both',
    icon: 'Tag',
  };
};
