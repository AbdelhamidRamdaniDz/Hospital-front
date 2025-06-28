'use client';
import { useEffect, useState, useCallback, FC, ComponentPropsWithoutRef, ElementType } from 'react';
import { useAuth } from '@/hooks/useAuth';
import API from '@/lib/axios';
import Link from 'next/link';
import axios from 'axios';

// استيراد الأيقونات
import { Settings, ArrowLeft, Loader2, CheckCircle, AlertCircle, User, Mail, Lock } from 'lucide-react';

// واجهة بيانات المستشفى
interface HospitalProfile {
    name: string;
    email: string;
}

// واجهة خصائص مكون حقل الإدخال
interface InputFieldProps extends ComponentPropsWithoutRef<'input'> {
    icon: ElementType;
    label: string;
}


// المكون الرئيسي للصفحة
export default function SettingsPage() {
    const { user, isLoading: authLoading } = useAuth(); // ✅ تم تصحيح: loading -> isLoading
    const [profile, setProfile] = useState<HospitalProfile>({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [loading, setLoading] = useState(true);
    const [submittingProfile, setSubmittingProfile] = useState(false);
    const [submittingPassword, setSubmittingPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // جلب بيانات الملف الشخصي عند تحميل الصفحة
    const fetchProfile = useCallback(async () => {
        try {
            const res = await API.get('/hospitals/profile');
            if (res.data.success) {
                setProfile(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch profile:", err); // ✅ تم إضافة: تسجيل الخطأ للمساعدة في التصحيح
            setError('فشل في تحميل بيانات الملف الشخصي.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchProfile();
        } else if (!authLoading) {
            setLoading(false); // إيقاف التحميل إذا لم يكن هناك مستخدم
        }
    }, [user, authLoading, fetchProfile]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };
    
    const showToast = (message: string, type: 'success' | 'error') => {
        setSuccess(type === 'success' ? message : null);
        setError(type === 'error' ? message : null);
        setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 4000);
    };

    // دالة لتحديث الملف الشخصي
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingProfile(true);
        try {
            await API.put('/hospitals/profile', profile);
            showToast('تم تحديث الملف الشخصي بنجاح.', 'success');
        } catch (err) {
            const errorMsg = axios.isAxiosError(err) && err.response ? err.response.data.message : 'فشل تحديث الملف الشخصي.';
            showToast(errorMsg, 'error');
        } finally {
            setSubmittingProfile(false);
        }
    };
    
    // دالة لتحديث كلمة المرور
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            return showToast('كلمة المرور الجديدة وتأكيدها غير متطابقين.', 'error');
        }
        setSubmittingPassword(true);
        try {
            await API.put('/hospitals/profile/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            showToast('تم تحديث كلمة المرور بنجاح.', 'success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
             const errorMsg = axios.isAxiosError(err) && err.response ? err.response.data.message : 'فشل تحديث كلمة المرور.';
            showToast(errorMsg, 'error');
        } finally {
            setSubmittingPassword(false);
        }
    };
    
    if (authLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Settings className="w-10 h-10 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">إعدادات الحساب</h1>
                            <p className="text-gray-500">إدارة معلومات وبيانات المستشفى.</p>
                        </div>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-white px-4 py-2 rounded-lg border shadow-sm"><ArrowLeft className="w-5 h-5" /><span>العودة</span></Link>
                </header>

                 {success && <div className="mb-4 bg-green-100 text-green-800 p-3 rounded-lg flex items-center gap-2"><CheckCircle className="w-5 h-5"/>{success}</div>}
                 {error && <div className="mb-4 bg-red-100 text-red-800 p-3 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5"/>{error}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* نموذج معلومات الحساب */}
                    <div className="bg-white shadow-xl rounded-2xl p-6 border">
                        <h2 className="text-xl font-bold mb-5 text-gray-700">معلومات الحساب</h2>
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <InputField icon={User} label="اسم المستشفى" name="name" value={profile.name} onChange={handleProfileChange} />
                            <InputField icon={Mail} label="البريد الإلكتروني" name="email" type="email" value={profile.email} onChange={handleProfileChange} />
                            <div className="pt-2"><button type="submit" disabled={submittingProfile} className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400">{submittingProfile ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : 'حفظ التغييرات'}</button></div>
                        </form>
                    </div>

                    {/* نموذج تغيير كلمة المرور */}
                    <div className="bg-white shadow-xl rounded-2xl p-6 border">
                        <h2 className="text-xl font-bold mb-5 text-gray-700">تغيير كلمة المرور</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <InputField icon={Lock} label="كلمة المرور الحالية" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                            <InputField icon={Lock} label="كلمة المرور الجديدة" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
                            <InputField icon={Lock} label="تأكيد كلمة المرور الجديدة" name="confirmNewPassword" type="password" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} />
                            <div className="pt-2"><button type="submit" disabled={submittingPassword} className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400">{submittingPassword ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : 'تغيير كلمة المرور'}</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ✅ تم تحسين أنواع الخصائص هنا
const InputField: FC<InputFieldProps> = ({ icon: Icon, label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Icon className="w-5 h-5 text-gray-400"/></div>
            <input id={props.name} {...props} className="w-full border-gray-300 rounded-lg shadow-sm pr-10 pl-3 py-2 focus:border-blue-500 focus:ring-blue-500"/>
        </div>
    </div>
);
