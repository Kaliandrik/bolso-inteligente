import React, { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

export const Login: React.FC<{ onSwitchToRegister: () => void }> = ({ onSwitchToRegister }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login({ email, password });
        
        if (!result.success) {
            setError(result.error || 'E-mail ou senha incorretos');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50 p-4">
            <div className="w-full max-w-lg">
                {/* Header/Logo Section */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white p-3 rounded-3xl shadow-lg border border-emerald-50">
                            <img 
                                src="/imagens/logobolsainteligente.png" 
                                alt="Logo" 
                                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Bolso Inteligente
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Bem-vindo de volta! Acesse sua conta.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-6 sm:p-10 border border-gray-100">
                    
                    {/* Mensagem de Erro Profissional */}
                    {error && (
                        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-sm font-semibold text-red-800">
                                {error.replace('❌', '').trim()}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 py-3 bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-2xl transition-all"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

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
                                    className="pl-12 pr-12 py-3 bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-2xl transition-all"
                                    placeholder="Sua senha"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 py-6 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Entrar
                                    <LogIn className="w-5 h-5" />
                                </>
                            )}
                        </Button>

                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-500">
                                Não tem uma conta?{' '}
                                <button
                                    type="button"
                                    onClick={onSwitchToRegister}
                                    className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                                >
                                    Criar nova conta
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};