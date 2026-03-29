import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return format(date, "dd/MM/yyyy", { locale: ptBR });
};

export const formatMonthYear = (date: Date): string => {
  return format(date, "MMMM 'de' yyyy", { locale: ptBR });
};

export const getCurrentMonthYear = (): string => {
  return format(new Date(), "yyyy-MM");
};

export const parseDate = (dateStr: string): Date => {
  return new Date(dateStr);
};