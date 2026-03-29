import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { FinanceProvider } from './contexts/FinanceContext';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

const AppContent: React.FC = () => {
  const { state } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  // MUDANÇA CRITICAL: Só mostra o loading de tela cheia se for a carga INICIAL do app.
  // Se o usuário NÃO está autenticado, ignoramos o isLoading global para o Login não sumir.
  if (state.isLoading && state.user === null && state.isAuthenticated === false) {
    // Se quiser ver se o problema sumiu, pode até comentar esse bloco inteiro temporariamente.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando seu bolso...</p>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return showLogin ? (
      <Login onSwitchToRegister={() => setShowLogin(false)} />
    ) : (
      <Register onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Dashboard />
      </div>
    </FinanceProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;