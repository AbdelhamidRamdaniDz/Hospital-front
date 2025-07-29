'use client';
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import API from '@/lib/axios';

type Role = 'hospital' | 'paramedic' | 'super-admin';
interface User {
  _id: string;
  email: string;
  role: Role;
  displayName: string;
  name?: string;
  fullName?: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await API.get('/auth/me');
      if (res.data.success) {
          const userData = {
              ...res.data.data,
              displayName: res.data.data.name || res.data.data.fullName
          };
          setUser(userData);
      }
    } catch (err) {
      console.error('فشل في جلب بيانات المستخدم', err);
      setUser(null);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};