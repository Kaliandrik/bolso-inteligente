import { useMemo } from 'react';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Transaction, MonthlySummary } from '../types/finance';
import { useFinance } from './useFinance';

export const useMonthlySummary = (selectedDate: Date): MonthlySummary => {
  const { state } = useFinance();

  return useMemo((): MonthlySummary => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    const monthTransactions: Transaction[] = state.transactions.filter((transaction: Transaction) =>
      isWithinInterval(transaction.date, { start: monthStart, end: monthEnd })
    );

    const totalIncome: number = monthTransactions
      .filter((t: Transaction) => t.type === 'income')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    const totalExpense: number = monthTransactions
      .filter((t: Transaction) => t.type === 'expense')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    const balance: number = totalIncome - totalExpense;
    const savedAmount: number = balance > 0 ? balance : 0;
    const savingsRate: number = totalIncome > 0 ? (savedAmount / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpense,
      balance,
      savingsRate,
      savedAmount,
    };
  }, [state.transactions, selectedDate]);
};

export default useMonthlySummary;