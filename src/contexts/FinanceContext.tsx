import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import type { Transaction, FinanceState, Period } from '../types';
import { financeService } from '../services/financeService';
import { useAuth } from '../hooks/useAuth';

type FinanceAction =
  | { type: 'LOAD_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'SET_SELECTED_PERIOD'; payload: Period }
  | { type: 'SET_SELECTED_MONTH'; payload: Date };

const initialState: FinanceState = {
  transactions: [],
  selectedPeriod: 'month',
  selectedMonth: new Date(),
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'LOAD_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case 'SET_SELECTED_PERIOD':
      return { ...state, selectedPeriod: action.payload };
    case 'SET_SELECTED_MONTH':
      return { ...state, selectedMonth: action.payload };
    default:
      return state;
  }
};

interface FinanceContextType {
  state: FinanceState;
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  setSelectedPeriod: (period: Period) => void;
  setSelectedMonth: (date: Date) => void;
}

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(true);
  const { state: authState } = useAuth();

  const loadTransactions = React.useCallback(async () => {
    if (!authState.user) {
      dispatch({ type: 'LOAD_TRANSACTIONS', payload: [] });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const transactions = await financeService.getTransactions(authState.user.uid);
      dispatch({ type: 'LOAD_TRANSACTIONS', payload: transactions });
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authState.user]);

  useEffect(() => {
    loadTransactions();
  }, [authState.user, loadTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    if (!authState.user) return;

    try {
      // Passamos o uid e os dados (sem o id/userId que o service não quer no add)
      const id = await financeService.addTransaction(authState.user.uid, transaction);
      
      const transactionWithId: Transaction = { 
        ...transaction, 
        id, 
        userId: authState.user.uid 
      };
      
      dispatch({ type: 'ADD_TRANSACTION', payload: transactionWithId });
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!authState.user) return;

    try {
      // NOVO: Passamos o uid do usuário logado e o id da transação
      await financeService.deleteTransaction(authState.user.uid, id);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    if (!authState.user) return;

    try {
      // NOVO: Passamos uid, transactionId e o corpo da transação
      await financeService.updateTransaction(authState.user.uid, transaction.id, transaction);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const setSelectedPeriod = (period: Period) => {
    dispatch({ type: 'SET_SELECTED_PERIOD', payload: period });
  };

  const setSelectedMonth = (date: Date) => {
    dispatch({ type: 'SET_SELECTED_MONTH', payload: date });
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        isLoading,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        setSelectedPeriod,
        setSelectedMonth,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};