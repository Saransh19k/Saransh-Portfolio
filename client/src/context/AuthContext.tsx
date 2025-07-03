import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

interface User {
  id: string;
  email: string;
  role: 'user' | 'developer';
  name?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  website?: string;
  location?: string;
  preferences?: any;
  lastLoginAt?: string;
  loginCount?: number;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDeveloper: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string, adminKey: string) => Promise<boolean>;
  signup: (userData: { firstName: string; lastName: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          const response = await authAPI.getProfile();
          if (response.success) {
            const userData = response.data.user;
            setUser({
              id: userData.id.toString(),
              email: userData.email,
              role: userData.role,
              name: `${userData.firstName} ${userData.lastName}`,
              firstName: userData.firstName,
              lastName: userData.lastName,
              bio: userData.bio,
              website: userData.website,
              location: userData.location,
              preferences: userData.preferences,
              lastLoginAt: userData.lastLoginAt,
              loginCount: userData.loginCount,
              emailVerified: userData.emailVerified,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
              profilePicture: userData.profilePicture,
            });
          }
        } catch (error) {
          console.error('Failed to get user profile:', error);
          // Clear invalid token
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        const userData = response.data.user;
        const token = response.data.token;
        
        // Store token
        localStorage.setItem('authToken', token);
        
        // Set user state
        setUser({
          id: userData.id.toString(),
          email: userData.email,
          role: userData.role,
          name: `${userData.firstName} ${userData.lastName}`,
          firstName: userData.firstName,
          lastName: userData.lastName,
          bio: userData.bio,
          website: userData.website,
          location: userData.location,
          preferences: userData.preferences,
          lastLoginAt: userData.lastLoginAt,
          loginCount: userData.loginCount,
          emailVerified: userData.emailVerified,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          profilePicture: userData.profilePicture,
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string, adminKey: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.adminLogin({ email, password, adminKey });
      
      if (response.success) {
        const userData = response.data.user;
        const token = response.data.token;
        
        // Store token
        localStorage.setItem('authToken', token);
        
        // Set user state
        setUser({
          id: userData.id.toString(),
          email: userData.email,
          role: userData.role,
          name: `${userData.firstName} ${userData.lastName}`,
          firstName: userData.firstName,
          lastName: userData.lastName,
          bio: userData.bio,
          website: userData.website,
          location: userData.location,
          preferences: userData.preferences,
          lastLoginAt: userData.lastLoginAt,
          loginCount: userData.loginCount,
          emailVerified: userData.emailVerified,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          profilePicture: userData.profilePicture,
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Admin login error:', error);
      setError(error.response?.data?.message || 'Admin login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: { firstName: string; lastName: string; email: string; password: string }): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      
      if (response.success) {
        const newUser = response.data.user;
        const token = response.data.token;
        
        // Store token
        localStorage.setItem('authToken', token);
        
        // Set user state
        setUser({
          id: newUser.id.toString(),
          email: newUser.email,
          role: newUser.role,
          name: `${newUser.firstName} ${newUser.lastName}`,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          bio: newUser.bio,
          website: newUser.website,
          location: newUser.location,
          preferences: newUser.preferences,
          lastLoginAt: newUser.lastLoginAt,
          loginCount: newUser.loginCount,
          emailVerified: newUser.emailVerified,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
          profilePicture: newUser.profilePicture,
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.response?.data?.message || 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setError(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isDeveloper: user?.role === 'developer',
    login,
    adminLogin,
    signup,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 