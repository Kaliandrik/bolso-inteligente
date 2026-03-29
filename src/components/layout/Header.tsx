import React, { useState } from 'react';
import { LogOut, User, ChevronDown, Menu, X, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { formatMonthYear } from '../../utils/formatters';
import { useFinance } from '../../hooks/useFinance';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const { state, setSelectedMonth } = useFinance();
  const { state: authState, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handlePreviousMonth = () => {
    const newDate = new Date(state.selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(state.selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedMonth(newDate);
  };

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-800/50 bg-[#064e3b]/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-6">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4 group cursor-pointer transition-opacity hover:opacity-90">
            <div className="relative flex items-center justify-center">
              <img 
                src="/imagens/logobolsainteligente.png" 
                alt="Logo" 
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
              />
            </div>
            
            <div className="hidden sm:flex flex-col">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight italic">
                Bolso <span className="text-emerald-400 not-italic font-medium">Inteligente</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-emerald-300/60 uppercase tracking-[0.2em]">
                  Gestão Ativa
                </span>
              </div>
            </div>
          </div>
          
          {/* Navegador de Mês */}
          <nav className="flex items-center bg-emerald-900/40 border border-white/5 rounded-2xl p-1 shadow-inner">
            <button
              onClick={handlePreviousMonth}
              className="text-white/60 hover:text-white p-2.5 transition-all rounded-xl hover:bg-white/5 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <span className="text-white font-medium text-xs sm:text-sm px-4 min-w-[140px] text-center capitalize tabular-nums tracking-wide">
              {formatMonthYear(state.selectedMonth)}
            </span>
            <button
              onClick={handleNextMonth}
              className="text-white/60 hover:text-white p-2.5 transition-all rounded-xl hover:bg-white/5 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </nav>
          
          {/* Perfil do Usuário - Desktop */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] transition-all border border-white/10 group active:scale-[0.98]"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-white rounded-xl flex items-center justify-center shadow-md transform group-hover:rotate-3 transition-transform">
                <User className="w-5 h-5 text-emerald-800" strokeWidth={2} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">
                  {authState.user?.name?.split(' ')[0]}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Conta Ativa</span>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform duration-300 ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-5 border-b border-slate-50 bg-slate-50/40">
                    <p className="font-bold text-slate-900 truncate text-sm">{authState.user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">{authState.user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                        <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-500" />
                      </div>
                      Sair da plataforma
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Menu Mobile Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-xl bg-white/5 text-white/80 hover:bg-white/10 active:scale-95 transition-all"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-2 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-emerald-900/90 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <User className="w-7 h-7 text-emerald-700" />
                </div>
                <div>
                  <p className="text-base font-bold text-white tracking-tight">{authState.user?.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                     <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                     <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">Conta Ativa</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white/10 text-white hover:bg-white/20 rounded-2xl text-sm font-bold transition-all border border-white/10"
              >
                <LogOut className="w-4 h-4" />
                Encerrar Sessão
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;