import React, { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

export const Login: React.FC<{ onSwitchToRegister: () => void }> = ({ onSwitchToRegister }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        const result = await login({ email, password });
        
        if (!result.success) {
            setError(result.error || 'E-mail ou senha incorretos');
        }
        setLoading(false);
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Digite seu e-mail no campo acima para recuperar a senha.');
            // Focar no campo de email para ajudar o usuário
            document.getElementById('email-input')?.focus();
            return;
        }

        setError('');
        setSuccessMessage('');
        setResetLoading(true);

        try {
            await authService.resetPassword(email);
            setSuccessMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        } catch (err: any) {
            setError('Erro ao enviar e-mail. Verifique se o endereço está correto.');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50 p-4">
            <div className="w-full max-w-lg">
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
                    
                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="text-sm font-semibold text-red-800">
                                {error.replace('❌', '').trim()}
                            </p>
                        </div>
                    )}

                    {/* Mensagem de Sucesso (Recuperação de Senha) */}
                    {successMessage && (
                        <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <p className="text-sm font-semibold text-emerald-800">
                                {successMessage}
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
                                    id="email-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 py-3 bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-2xl transition-all"
                                    placeholder="seu@email.com"
                                    required={!resetLoading} // Não obrigatório se estiver apenas recuperando a senha, mas o ID ajuda a focar
                                />
                            </div>
                        </div>

                        <div>
                            {/* Label da Senha (sozinho no topo) */}
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
                                    required={!resetLoading} // Não obrigatório se estiver apenas recuperando a senha
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Botão "Esqueceu sua senha?" (Agora embaixo do campo) */}
                            <div className="flex justify-end mt-2 mr-1">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    disabled={resetLoading}
                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-bold transition-colors disabled:opacity-50"
                                >
                                    {resetLoading ? 'Enviando...' : 'Esqueceu sua senha?'}
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