import React, { useState } from 'react'; // Adicionado useState
import { Trash2, Edit, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Transaction } from '../../types/finance';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useFinance } from '../../hooks/useFinance';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

const categoryColors: Record<string, string> = {
  Alimentação: 'bg-orange-100 text-orange-800',
  Transporte: 'bg-blue-100 text-blue-800',
  Moradia: 'bg-purple-100 text-purple-800',
  Lazer: 'bg-pink-100 text-pink-800',
  Saúde: 'bg-green-100 text-green-800',
  Educação: 'bg-yellow-100 text-yellow-800',
  Salário: 'bg-emerald-100 text-emerald-800',
  Freelance: 'bg-cyan-100 text-cyan-800',
  Investimentos: 'bg-indigo-100 text-indigo-800',
  Outros: 'bg-gray-100 text-gray-800',
};

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit }) => {
  const { deleteTransaction, isLoading } = useFinance();
  
  // ESTADO PARA O MODAL DE EXCLUSÃO
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Carregando transações...</p>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          Nenhuma transação encontrada
        </CardContent>
      </Card>
    );
  }

  // FUNÇÃO QUE EXECUTA A EXCLUSÃO REAL
  const confirmDelete = async () => {
    if (deletingId) {
      await deleteTransaction(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* MODAL DE CONFIRMAÇÃO PERSONALIZADO */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Excluir transação?</h3>
              <p className="text-sm text-gray-500 mt-2 mb-6">
                Tem certeza que deseja apagar este registro? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setDeletingId(null)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                  onClick={confirmDelete}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Transações</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction: Transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium">{transaction.description}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[transaction.category] || categoryColors.Outros}`}>
                      {transaction.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(transaction.id)} // Alterado para setar o ID
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TransactionList;