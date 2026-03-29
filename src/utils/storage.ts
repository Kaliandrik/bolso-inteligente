import { Transaction } from '../types/finance';

const STORAGE_KEYS = {
  TRANSACTIONS: '@finance:transactions',
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    const serialized = JSON.stringify(transactions);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, serialized);
    console.log('Transações salvas:', transactions.length); // Para debug
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

export const loadTransactions = (): Transaction[] => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!serialized) return [];
    
    const transactions = JSON.parse(serialized);
    const transactionsWithDates = transactions.map((t: any) => ({
      ...t,
      date: new Date(t.date),
    }));
    console.log('Transações carregadas:', transactionsWithDates.length); // Para debug
    return transactionsWithDates;
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};