'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';
import API from '@/lib/axios';
type Role = 'hospital' | 'paramedic' | 'super-admin';

interface User {
  email: string;
  role: Role;
  displayName: string;
}

interface AuthContextProps {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/me'); // 🟢 هذا المسار يجب أن يرجع بيانات المستخدم
        setUser(res.data.user); // يجب أن تكون `user` موجودة في `res.data.user`
      } catch (err) {
        console.warn('فشل في استرداد المستخدم:', err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
