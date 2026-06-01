"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import API, { logout } from '@/services/api';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to check if token is valid (basic validation)
const isTokenValid = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  try {
    // Basic JWT token validation (check if it's properly formatted)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if token is expired
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const storedToken = localStorage.getItem('token');
      
      if (storedToken && isTokenValid()) {
        setToken(storedToken);
        // You could decode the JWT to get user info here
        // For now, we'll just set a basic user object
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          setUser({
            id: payload.userId || payload.id,
            email: payload.email,
            name: payload.name
          });
        } catch (error) {
          console.error('Failed to decode token:', error);
          // Don't clear token on decode error, just set basic user
          setUser({
            id: 'temp',
            email: 'user@example.com',
            name: 'User'
          });
        }
      } else {
        // No valid token, clear state
        setToken(null);
        setUser(null);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token: newToken } = response.data;
      
      setToken(newToken);
      
      // Set user info from token or create basic user object
      try {
        if (newToken) {
          const payload = JSON.parse(atob(newToken.split('.')[1]));
          setUser({
            id: payload.userId || payload.id,
            email: payload.email || email,
            name: payload.name || email.split('@')[0]
          });
        } else {
          // Fallback if token parsing fails
          setUser({
            id: 'temp',
            email: email,
            name: email.split('@')[0]
          });
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        // Still set basic user info even if decoding fails
        setUser({
          id: 'temp',
          email: email,
          name: email.split('@')[0]
        });
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', newToken);
      }
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    API.logout();
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout: handleLogout,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protecting routes
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null; // Will redirect
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};
