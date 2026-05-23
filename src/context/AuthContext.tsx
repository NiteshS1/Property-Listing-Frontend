import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '../api/auth';
import { ApiError, setUnauthorizedHandler } from '../api/client';
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
  TOKEN_KEY,
} from '../lib/token';
import type { LoginInput, SignupInput, User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAgent: boolean;
  login: (data: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(!!getStoredToken());

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
  }, []);

  const syncSession = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await authApi.me();
      setUser(profile);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  useEffect(() => {
    if (!getStoredToken()) {
      setIsLoading(false);
      return;
    }
    syncSession();
  }, [syncSession]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === TOKEN_KEY) {
        if (!getStoredToken()) {
          logout();
        } else {
          syncSession();
        }
      }
    };

    const onFocus = () => {
      if (!getStoredToken() && user) {
        logout();
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, [logout, syncSession, user]);

  const login = useCallback(
    async (data: LoginInput) => {
      const { user: loggedInUser, token } = await authApi.login(data);
      setStoredToken(token);
      setUser(loggedInUser);
    },
    [],
  );

  const signup = useCallback(async (data: SignupInput) => {
    await authApi.signup(data);
  }, []);

  const isAuthenticated = !!user && !!getStoredToken();
  const isAgent = isAuthenticated && user?.role === 'agent';

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      isAgent,
      login,
      signup,
      logout,
    }),
    [user, isLoading, isAuthenticated, isAgent, login, signup, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}
