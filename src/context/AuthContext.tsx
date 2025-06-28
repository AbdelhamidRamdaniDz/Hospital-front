'use client';
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import API from '@/lib/axios';

// واجهة بيانات المستخدم
type Role = 'hospital' | 'paramedic' | 'super-admin';
interface User {
  _id: string;
  email: string;
  role: Role;
  displayName: string;
  name?: string; // for hospital
  fullName?: string; // for paramedic
}

// واجهة خصائص سياق المصادقة
interface AuthContextProps {
  user: User | null;
  isLoading: boolean; // ✅ تم إضافة حالة التحميل هنا
  login: (userData: User) => void;
  logout: () => void;
}

// إنشاء السياق مع قيم افتراضية
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ إضافة حالة التحميل

  const fetchUser = useCallback(async () => {
    try {
      const res = await API.get('/auth/me');
      if (res.data.success) {
          // دمج اسم العرض ليكون موحداً
          const userData = {
              ...res.data.data,
              displayName: res.data.data.name || res.data.data.fullName
          };
          setUser(userData);
      }
    } catch (err) {
      // لا يعتبر خطأً إذا لم يكن المستخدم مسجلاً دخوله
      setUser(null);
    } finally {
        // ✅ إيقاف التحميل بعد انتهاء العملية
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