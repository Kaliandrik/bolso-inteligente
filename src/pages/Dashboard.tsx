import React, { useState, useMemo } from 'react';
import { Button } from '../components/ui/Button';
import { SummaryCards } from '../components/finance/SummaryCards';
import { TransactionForm } from '../components/finance/TransactionForm';
import { TransactionList } from '../components/finance/TransactionList';
import { ExpenseChart } from '../components/finance/ExpenseChart';
import { useFinance } from '../hooks/useFinance';
import { useMonthlySummary } from '../hooks/useMonthlySummary';
import { Transaction } from '../types/finance';
import { startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  LayoutDashboard, 
  Plus, 
  RefreshCw, 
  Wallet, 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { state, isLoading } = useFinance();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const summary = useMonthlySummary(state.selectedMonth);
  
  const monthTransactions: Transaction[] = useMemo(() => {
    const monthStart = startOfMonth(state.selectedMonth);
    const monthEnd = endOfMonth(state.selectedMonth);
    
    return state.transactions
      .filter((transaction: Transaction) =>
        isWithinInterval(transaction.date, { start: monthStart, end: monthEnd })
      )
      .sort((a: Transaction, b: Transaction) => b.date.getTime() - a.date.getTime());
  }, [state.transactions, state.selectedMonth]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
              <LayoutDashboard size={12} className="text-emerald-500" />
              Visão Geral
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              <span className="capitalize">
                {format(state.selectedMonth, 'MMMM', { locale: ptBR })}
              </span>
              <span className="text-slate-300 font-light ml-2">
                {format(state.selectedMonth, 'yyyy')}
              </span>
            </h1>
            <p className="text-slate-400 text-sm font-medium tracking-tight">
              Confira o desempenho das suas finanças neste mês.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all border border-transparent hover:border-emerald-100 bg-white shadow-sm"
              title="Recarregar dados"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            
            <Button 
              onClick={() => {
                setEditingTransaction(null);
                setShowForm(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center gap-2 border-none"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Transação</span>
            </Button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">Sincronizando suas finanças...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-700">
            <section>
              <SummaryCards summary={summary} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 xl:col-span-8 overflow-hidden">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <RefreshCw size={18} className="text-emerald-500" />
                      Atividades Recentes
                    </h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {monthTransactions.length} itens
                    </span>
                  </div>
                  
                  <div className="p-2 sm:p-4">
                    <TransactionList 
                      transactions={monthTransactions} 
                      onEdit={handleEdit}
                    />
                    
                    {monthTransactions.length === 0 && (
                      <div className="py-16 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-4">
                          <Wallet className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Nenhum registro</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-1">
                          Você ainda não lançou movimentações neste mês.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 xl:col-span-4 sticky top-8">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                    Distribuição de Gastos
                  </h3>
                  <div className="min-h-[300px] flex items-center justify-center">
                    <ExpenseChart transactions={monthTransactions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- AQUI ESTAVA O ERRO E AQUI ESTÁ A CORREÇÃO --- */}
        {showForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-lg animate-in zoom-in-95 duration-200">
              <TransactionForm
                onClose={() => {
                  setShowForm(false);
                  setEditingTransaction(null);
                }}
                editingTransaction={editingTransaction}
                selectedDate={state.selectedMonth} // <--- ADICIONADO AQUI
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;