export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'Alimentação'
  | 'Assinaturas & Apps'
  | 'Cuidados Pessoais'
  | 'Transporte'
  | 'Moradia'
  | 'Lazer'
  | 'Saúde'
  | 'Educação'
  | 'Salário'
  | 'Investimentos'
  | 'Outros';

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: Date;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
  savedAmount: number;
}

export type Period = 'month' | 'year' | 'all';

export interface FinanceState {
  transactions: Transaction[];
  selectedPeriod: Period;
  selectedMonth: Date;
}