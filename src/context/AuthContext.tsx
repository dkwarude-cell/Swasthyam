import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService, { User, SignupData, LoginData, OnboardingData, ApiResponse } from '../services/api';

// Storage keys
const TOKEN_KEY = '@swasthtel_token';
const USER_KEY = '@swasthtel_user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  error: string | null;
  
  // Auth methods
  signup: (data: SignupData) => Promise<ApiResponse<User>>;
  login: (data: LoginData) => Promise<ApiResponse<User>>;
  loginWithSocial: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  
  // Onboarding methods
  completeOnboarding: (data: OnboardingData) => Promise<ApiResponse<User>>;
  updateProfile: (data: Partial<User>) => Promise<ApiResponse<User>>;
  
  // Utility
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Computed properties
  const isAuthenticated = !!token && !!user;
  const isOnboardingComplete = user?.isOnboardingComplete ?? false;

  // Initialize auth state on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Update API service token when token changes
  useEffect(() => {
    apiService.setToken(token);
  }, [token]);

  const loadStoredAuth = async () => {
    try {
      setIsLoading(true);
      console.log('Loading stored auth...');
      
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      console.log('Stored token exists:', !!storedToken);
      console.log('Stored user exists:', !!storedUser);

      if (storedToken && storedUser) {
        setToken(storedToken);
        apiService.setToken(storedToken);
        
        // Verify token is still valid by fetching user
        try {
          const response = await apiService.getMe();
          
          if (response.success && response.user) {
            console.log('User verified successfully');
            setUser(response.user);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
          } else {
            // Token invalid, clear storage
            console.log('Token invalid, clearing storage');
            await clearStorage();
          }
        } catch (apiErr) {
          console.error('API error during auth load:', apiErr);
          // If API fails (e.g., network error), still use stored user but flag as potentially stale
          await clearStorage();
        }
      } else {
        console.log('No stored auth found, user needs to login');
      }
    } catch (err) {
      console.error('Error loading stored auth:', err);
      await clearStorage();
    } finally {
      console.log('Auth loading complete');
      setIsLoading(false);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      setToken(null);
      setUser(null);
      apiService.setToken(null);
    } catch (err) {
      console.error('Error clearing storage:', err);
    }
  };

  const signup = async (data: SignupData): Promise<ApiResponse<User>> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiService.signup(data);

      if (response.success && response.token && response.user) {
        // Store token and user
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
        
        setToken(response.token);
        setUser(response.user);
        
        return response;
      } else {
        setError(response.message || 'Signup failed');
        return response;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<ApiResponse<User>> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiService.login(data);

      if (response.success && response.token && response.user) {
        // Store token and user
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
        
        setToken(response.token);
        setUser(response.user);
        
        return response;
      } else {
        setError(response.message || 'Login failed');
        return response;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Login with social auth (for Google, Facebook, Apple)
  const loginWithSocial = async (authToken: string, authUser: User) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Store token and user
      await AsyncStorage.setItem(TOKEN_KEY, authToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(authUser));
      
      setToken(authToken);
      setUser(authUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Social login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await clearStorage();
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (!token) return;

      const response = await apiService.getMe();

      if (response.success && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      } else {
        // Token might be invalid
        await clearStorage();
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  const completeOnboarding = async (data: OnboardingData): Promise<ApiResponse<User>> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiService.completeOnboarding(data);

      if (response.success && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
        return response;
      } else {
        setError(response.message || 'Failed to complete onboarding');
        return response;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete onboarding';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      setError(null);

      const response = await apiService.updateProfile(data);

      if (response.success && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
        return response;
      } else {
        setError(response.message || 'Failed to update profile');
        return response;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      return { success: false, message };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isOnboardingComplete,
    error,
    signup,
    login,
    loginWithSocial,
    logout,
    refreshUser,
    completeOnboarding,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
