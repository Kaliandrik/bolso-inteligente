import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  getDocs,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { Transaction } from '../types/finance';

// Função auxiliar para pegar a referência da subcoleção de transações do usuário
const getUserTransactionsRef = (userId: string) => 
  collection(db, 'users', userId, 'transactions');

export const financeService = {
  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      // Como estamos dentro da subcoleção do usuário, não precisamos mais do 'where'
      // O Firebase já sabe que só existem transações DESTE usuário aqui.
      const q = query(
        getUserTransactionsRef(userId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          userId: userId, // O userId agora vem do contexto do caminho
          description: data.description,
          amount: data.amount,
          type: data.type,
          category: data.category,
          date: data.date.toDate(),
        });
      });
      
      return transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  },

  async addTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'userId'>): Promise<string> {
    try {
      // Adiciona na subcoleção do usuário específico
      const docRef = await addDoc(getUserTransactionsRef(userId), {
        ...transaction,
        date: Timestamp.fromDate(transaction.date),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  async updateTransaction(userId: string, transactionId: string, transaction: Partial<Transaction>): Promise<void> {
    try {
      // Referência exata: users -> userId -> transactions -> transactionId
      const transactionRef = doc(db, 'users', userId, 'transactions', transactionId);
      
      const updateData: any = { ...transaction };
      if (transaction.date) {
        updateData.date = Timestamp.fromDate(transaction.date);
      }
      
      // Removemos o userId dos dados de update para não duplicar informação desnecessária
      delete updateData.userId;
      delete updateData.id;

      await updateDoc(transactionRef, updateData);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    try {
      const transactionRef = doc(db, 'users', userId, 'transactions', transactionId);
      await deleteDoc(transactionRef);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },
};