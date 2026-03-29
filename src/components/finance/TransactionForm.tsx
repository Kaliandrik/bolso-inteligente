import React, { useState } from 'react';
import { Plus, X, Receipt, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Transaction, TransactionType, TransactionCategory } from '../../types';
import { useFinance } from '../../hooks/useFinance';

interface TransactionFormProps {
  onClose: () => void;
  editingTransaction?: Transaction | null;
}

const categoryOptions: { value: TransactionCategory; label: string }[] = [
  { value: 'Alimentação', label: 'Alimentação' },
  { value: 'Assinaturas & Apps', label: 'Assinaturas & Apps' },
  { value: 'Cuidados Pessoais', label: 'Cuidados Pessoais' },
  { value: 'Educação', label: 'Educação' },
  { value: 'Investimentos', label: 'Investimentos' },
  { value: 'Lazer', label: 'Lazer' },
  { value: 'Moradia', label: 'Moradia' },
  { value: 'Saúde', label: 'Saúde' },
  { value: 'Transporte', label: 'Transporte' },
  { value: 'Salário', label: 'Salário' },
  { value: 'Outros', label: 'Outros' },
];

const typeOptions: { value: TransactionType; label: string }[] = [
  { value: 'income', label: 'Receita' },
  { value: 'expense', label: 'Despesa' },
];

interface FormData {
  description: string;
  amount: string;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, editingTransaction }) => {
  const { addTransaction, updateTransaction } = useFinance();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    description: editingTransaction?.description || '',
    amount: editingTransaction?.amount?.toString() || '',
    type: editingTransaction?.type || 'expense',
    category: editingTransaction?.category || 'Outros',
    date: editingTransaction?.date 
      ? new Date(editingTransaction.date).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || showSuccess) return;

    const amount = parseFloat(formData.amount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    setIsLoading(true);

    try {
      const transactionData = {
        description: formData.description,
        amount,
        type: formData.type,
        category: formData.category,
        date: new Date(formData.date),
      };

      if (editingTransaction) {
        await updateTransaction({ ...editingTransaction, ...transactionData } as Transaction);
      } else {
        await addTransaction(transactionData);
      }

      setIsLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
      }, 2200);

    } catch (error) {
      setIsLoading(false);
      console.error("Erro ao salvar:", error);
      alert("Ocorreu um erro ao salvar a transação.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 animate-in fade-in duration-300">
      
      {showSuccess && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[110] animate-toast-in">
          <div className="bg-emerald-600 text-white px-7 py-3.5 rounded-3xl shadow-3xl flex items-center gap-3.5 border border-white/10 ring-4 ring-emerald-500/20">
            <CheckCircle2 className="w-6 h-6 text-emerald-200" strokeWidth={2.5} />
            <span className="font-extrabold text-sm tracking-tight text-center">Lançamento realizado com sucesso!</span>
          </div>
        </div>
      )}

      <div className={`bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh] border border-slate-100 overflow-hidden animate-modal-in transition-all duration-700 ease-in-out ${showSuccess ? 'scale-[0.9] opacity-0 grayscale blur-sm pointer-events-none' : 'scale-100 opacity-100 blur-0 grayscale-0'}`}>
        
        <div className="flex justify-between items-center p-6 sm:p-8 pb-4 border-b border-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm">
              <Receipt className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                {editingTransaction ? 'Editar Registro' : 'Novo Registro'}
              </h2>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1.5 block">
                Gestão Ativa
              </span>
            </div>
          </div>
          {!isLoading && !showSuccess && (
            <button onClick={onClose} className="p-2.5 hover:bg-slate-50 rounded-full transition-colors group">
              <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} id="transaction-form" className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 custom-scrollbar">
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Descrição</label>
            <Input
              type="text"
              required
              maxLength={40} // Evita que o usuário insira nomes gigantes que quebram o layout
              disabled={isLoading || showSuccess}
              className="rounded-2xl border-slate-200 h-12 focus:border-emerald-500 focus:ring-emerald-500/10 transition-colors"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Mercado, Aluguel..."
            />
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Valor (R$)</label>
              <Input
                type="text"
                required
                disabled={isLoading || showSuccess}
                className="rounded-2xl border-slate-200 font-bold text-emerald-700 h-12 text-lg focus:border-emerald-500 focus:ring-emerald-500/10 transition-colors"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Data</label>
              <Input
                type="date"
                required
                disabled={isLoading || showSuccess}
                className="rounded-2xl border-slate-200 h-12 text-slate-600 font-medium focus:border-emerald-500 focus:ring-emerald-500/10 transition-colors"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Fluxo</label>
              <Select
                options={typeOptions}
                disabled={isLoading || showSuccess}
                className="rounded-2xl border-slate-200 h-12 font-medium focus:border-emerald-500 focus:ring-emerald-500/10 transition-colors"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
              />
            </div>
            
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Categoria</label>
              <Select
                options={categoryOptions}
                disabled={isLoading || showSuccess}
                className="rounded-2xl border-slate-200 h-12 font-medium focus:border-emerald-500 focus:ring-emerald-500/10 transition-colors"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
              />
            </div>
          </div>
        </form>

        <div className="p-6 sm:p-8 pt-4 border-t border-slate-50 bg-slate-50/50 flex-shrink-0">
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isLoading || showSuccess}
              className="flex-1 rounded-2xl h-12 font-bold text-slate-500 border-slate-200 text-xs active:scale-95 transition-all"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              form="transaction-form"
              disabled={isLoading || showSuccess}
              className={`flex-1 rounded-2xl h-12 font-bold shadow-lg text-xs text-white flex items-center justify-center transition-all duration-300 ${isLoading ? 'bg-emerald-400 cursor-not-allowed shadow-none' : showSuccess ? 'bg-emerald-500 opacity-50 scale-95' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 active:scale-95'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : showSuccess ? (
                'Lançado!'
              ) : (
                <>
                   <Plus className="w-4 h-4 mr-1.5" strokeWidth={3} />
                   {editingTransaction ? 'Salvar Registro' : 'Confirmar Registro'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;