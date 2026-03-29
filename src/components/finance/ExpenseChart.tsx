import React from 'react';
import { Transaction } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ExpenseChartProps {
  transactions: Transaction[];
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const expensesByCategory = transactions
    .filter((t: Transaction) => t.type === 'expense')
    .reduce((acc: Record<string, number>, transaction: Transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalExpense = Object.values(expensesByCategory).reduce((sum, value) => sum + value, 0);
  const data = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 border-dashed">
          <BarChart3 size={24} className="text-slate-300" />
        </div>
        <p className="text-slate-400 text-sm font-medium italic tracking-tight">Nenhum gasto registrado</p>
      </div>
    );
  }

  const colors = [
    '#10b981', '#6366f1', '#f59e0b', '#ec4899', 
    '#06b6d4', '#8b5cf6', '#f43f5e', '#14b8a6'
  ];

  const tailwindColors = [
    'bg-emerald-500', 'bg-indigo-500', 'bg-amber-500', 'bg-pink-500',
    'bg-cyan-500', 'bg-violet-500', 'bg-rose-500', 'bg-teal-500'
  ];

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
      {/* Gráfico Donut */}
      <div className="relative h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={8}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                  className="outline-none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Info centralizada - Peso reduzido para semibold */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] mb-1">Total</span>
          <h4 className="text-2xl font-semibold text-slate-800 tracking-tight tabular-nums">
            {formatCurrency(totalExpense)}
          </h4>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="space-y-6 flex-1 px-1">
        {data.map((item, index) => {
          const percentage = (item.value / totalExpense) * 100;
          const colorClass = tailwindColors[index % tailwindColors.length];
          
          return (
            <div key={item.name} className="group">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
                  <span className="text-sm font-medium text-slate-600 tracking-tight">{item.name}</span>
                </div>
                <div className="text-right flex items-center gap-3">
                  {/* Número com font-medium em vez de font-black */}
                  <span className="text-sm font-medium text-slate-700 tabular-nums">
                    {formatCurrency(item.value)}
                  </span>
                  <span className="text-[10px] font-medium text-slate-300 w-8">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                <div
                  className={`${colorClass} h-full rounded-full transition-all duration-1000 ease-out opacity-60 group-hover:opacity-100`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé Premium */}
      <div className="pt-6 border-t border-slate-50 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50/50 rounded-full border border-slate-100">
            <BarChart3 size={12} className="text-slate-400" />
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              {data.length} {data.length === 1 ? 'Categoria' : 'Categorias'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
              Fluxo Ativo
            </span>
          </div>
        </div>
        
        <p className="text-[9px] text-center text-slate-200 font-medium mt-5 uppercase tracking-[0.3em]">
          Monitoramento em Tempo Real
        </p>
      </div>
    </div>
  );
};

export default ExpenseChart;