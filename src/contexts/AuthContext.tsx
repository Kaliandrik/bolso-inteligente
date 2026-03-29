import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '../types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { authService } from '../services/authService';
import { doc, getDoc } from 'firebase/firestore';

type AuthAction =
    | { type: 'LOGIN_SUCCESS'; payload: User }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        default:
            return state;
    }
};

interface AuthContextType {
    state: AuthState;
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
    register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Monitora o estado da autenticação e carrega dados do Firestore
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    const userData = userDoc.data();

                    const user: User = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email!,
                        name: userData?.name || firebaseUser.displayName || 'Usuário',
                        createdAt: userData?.createdAt?.toDate() || new Date(),
                    };

                    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
                } catch (error) {
                    console.error('Error loading user data:', error);
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            } else {
                dispatch({ type: 'LOGOUT' });
            }
        });

        return () => unsubscribe();
    }, []);

   const login = async (credentials: LoginCredentials) => {
    try {
        // Remova ou comente a linha abaixo se quiser que a tela de Login NUNCA suma
        // dispatch({ type: 'SET_LOADING', payload: true }); 
        
        const user = await authService.login(credentials.email, credentials.password);
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return { success: true };
        
    } catch (error: any) {
        // Garante que o loading pare se deu erro
        dispatch({ type: 'SET_LOADING', payload: false });

        let errorMessage = 'E-mail ou senha incorretos';
        if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Muitas tentativas. Tente mais tarde.';
        }

        return { success: false, error: errorMessage };
    }
};

   const register = async (credentials: RegisterCredentials) => {
    try {
        // COMENTE OU REMOVA A LINHA ABAIXO
        // dispatch({ type: 'SET_LOADING', payload: true }); 
        
        const user = await authService.register(
            credentials.email,
            credentials.password,
            credentials.name
        );
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return { success: true };
        
    } catch (error: any) {
        // Garante que se houver erro, o loading global não fique travado (caso tenha sido ativado)
        dispatch({ type: 'SET_LOADING', payload: false });

        console.error('Register error code:', error.code);
        let errorMessage = 'Erro ao criar conta';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Este e-mail já está cadastrado';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'O e-mail digitado é inválido';
        }

        // Retorna o erro para o componente ler, sem resetar a tela
        return { success: false, error: errorMessage };
    }
};

    const logout = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await authService.logout();
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            console.error('Error logging out:', error);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return (
        <AuthContext.Provider value={{ state, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};