import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { MonthlySummary } from '../../types/finance';

interface SummaryCardsProps {
  summary: MonthlySummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const cards = [
    {
      title: 'Receitas',
      value: summary.totalIncome,
      icon: ArrowUpCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Despesas',
      value: summary.totalExpense,
      icon: ArrowDownCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Saldo',
      value: summary.balance,
      icon: Wallet,
      color: summary.balance >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: summary.balance >= 0 ? 'bg-blue-50' : 'bg-red-50',
    },
    {
      title: 'Economia',
      value: summary.savingsRate,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      format: (value: number) => `${value.toFixed(1)}%`,
      subtitle: summary.savedAmount > 0 ? `${formatCurrency(summary.savedAmount)}` : '',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const formattedValue = card.format 
          ? card.format(card.value) 
          : formatCurrency(card.value);
        
        return (
          <div 
            key={index} 
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 sm:p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">{card.title}</p>
                <p className={`text-lg sm:text-xl md:text-2xl font-bold ${card.color} truncate`}>
                  {formattedValue}
                </p>
                {card.subtitle && (
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <PiggyBank className="w-3 h-3" />
                    Guardou {card.subtitle}
                  </p>
                )}
              </div>
              <div className={`${card.bgColor} p-2 sm:p-3 rounded-full flex-shrink-0 ml-2`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;