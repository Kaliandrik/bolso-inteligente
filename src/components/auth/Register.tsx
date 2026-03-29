import React, { useState } from 'react';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

export const Register: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError('');
    
    // Validações Locais
    if (!name.trim()) return setError('Por favor, digite seu nome');
    if (!email.trim()) return setError('Por favor, digite seu email');
    if (!password.trim()) return setError('Por favor, digite sua senha');
    if (password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres');
    if (password !== confirmPassword) return setError('As senhas não coincidem');
    
    setLocalLoading(true);

    try {
      const result = await register({ name, email, password, confirmPassword });
      if (result && !result.success) {
        setError(result.error || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50 p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Header/Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-3xl shadow-lg border border-emerald-50">
              <img 
                src="/imagens/logobolsainteligente.png" 
                alt="Bolso Inteligente" 
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Criar sua conta
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Junte-se a nós e organize sua vida financeira
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-6 sm:p-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            
            {/* Mensagem de Erro Profissional */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm font-semibold text-red-800">
                  {error.replace('❌', '').trim()}
                </p>
              </div>
            )}
            
            <div className="grid gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 py-3 bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-2xl transition-all"
                    placeholder="Como quer ser chamado?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 py-3 bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-2xl transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-10 py-3 bg-gray-50 border-gray-100 rounded-2xl focus:bg-white transition-all"
                      placeholder="******"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    Confirmar
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 pr-10 py-3 bg-gray-50 border-gray-100 rounded-2xl focus:bg-white transition-all"
                      placeholder="******"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 py-6 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
              disabled={localLoading}
            >
              {localLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Finalizar Cadastro
                  <UserPlus className="w-5 h-5" />
                </>
              )}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                >
                  Entrar agora
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};