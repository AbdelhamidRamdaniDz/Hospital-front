'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import API from '@/lib/axios';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, Shield, Hospital, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'hospital' | 'super-admin'>('hospital');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await API.post('/auth/login', { email, password, role });

            if (res.data.success) {
                login(res.data.data); 
                setSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه...');
                setTimeout(() => {
                    if (res.data.data.role === 'super-admin') {
                        router.push('/admin/dashboard');
                    } else {
                        router.push('/dashboard');
                    }
                }, 1000);
            }

        } catch (err) {
            console.error('خطأ في تسجيل الدخول:', err);
            const errorMsg = axios.isAxiosError(err) && err.response 
                ? err.response.data.message 
                : 'فشل تسجيل الدخول. يرجى التحقق من البيانات المدخلة.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4" dir="rtl">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-3xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl mb-4 shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-emerald-700 bg-clip-text text-transparent mb-2">
                            مرحباً بك
                        </h1>
                        <p className="text-gray-600">قم بتسجيل الدخول للوصول إلى النظام</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 animate-fadeIn">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 animate-fadeIn">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{success}</span>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="أدخل بريدك الإلكتروني"
                                    className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-black text-right"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="أدخل كلمة المرور"
                                    className="w-full pr-12 pl-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-black text-right"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">نوع المستخدم</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${role === 'hospital' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`} onClick={() => setRole('hospital')} disabled={isLoading}>
                                    <Hospital className="w-6 h-6" />
                                    <span className="text-sm font-medium">مستشفى</span>
                                </button>
                                <button type="button" className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${role === 'super-admin' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`} onClick={() => setRole('super-admin')} disabled={isLoading}>
                                    <Shield className="w-6 h-6" />
                                    <span className="text-sm font-medium">مسؤول أعلى</span>
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
                             {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin"/>
                                    جاري تسجيل الدخول...
                                </>
                            ) : (
                                'تسجيل الدخول'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
}