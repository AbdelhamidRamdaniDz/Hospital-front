'use client';
import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import API from '@/lib/axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

import { 
    UserPlus, 
    ArrowLeft, 
    Loader2,
    CheckCircle,
    AlertCircle,
    Hospital,
    Ambulance,
    Mail,
    Lock,
    User,
    MapPin,
    Shield,
    PlusCircle
} from 'lucide-react';

function CreateUserForm() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const role = searchParams.get('role') || 'hospital';

    const [formData, setFormData] = useState({
        role: role,
        displayName: '',
        email: '',
        password: '',
        formattedAddress: '',
        longitude: '',
        latitude: '',
        nationalId: '',
        associatedAmbulance: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        setFormData(prev => ({ ...prev, role: role }));
    }, [role]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        
        try {
            await API.post('/admin/users', formData);
            setSuccess(`تم إنشاء حساب ${role === 'hospital' ? 'المستشفى' : 'المسعف'} بنجاح!`);
            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 2000);
        } catch (err) {
            const errorMsg = axios.isAxiosError(err) && err.response 
                ? err.response.data.message 
                : 'حدث خطأ غير متوقع.';
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };
    
    if (!user || user.role !== 'super-admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200">
                    <div className="flex items-center gap-3 text-red-600">
                        <AlertCircle className="w-8 h-8" />
                        <span className="text-xl font-bold text-red-800">وصول مرفوض</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
                                <UserPlus className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-1">إنشاء مستخدم جديد</h1>
                                <p className="text-gray-600 text-lg">
                                    أنت تقوم بإنشاء حساب {role === 'hospital' ? 'مستشفى' : 'مسعف'} جديد
                                </p>
                            </div>
                        </div>
                        <Link 
                            href="/admin/dashboard" 
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200 shadow-sm border border-gray-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">العودة للوحة التحكم</span>
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {role === 'hospital' ? (
                                    <Hospital className="w-6 h-6 text-blue-600" />
                                ) : (
                                    <Ambulance className="w-6 h-6 text-green-600" />
                                )}
                                <span className="font-semibold text-gray-800">
                                    نوع الحساب: {role === 'hospital' ? 'مستشفى' : 'مسعف'}
                                </span>
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-1/3"></div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {success && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 p-4 rounded-2xl flex items-center gap-3 border border-green-200 shadow-sm">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                    <p className="font-medium">{success}</p>
                                </div>
                            )}
                            {error && (
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 text-red-800 p-4 rounded-2xl flex items-center gap-3 border border-red-200 shadow-sm">
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="border-b border-gray-200 pb-4">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-600" />
                                        المعلومات الأساسية
                                    </h3>
                                    <p className="text-gray-600 mt-1">أدخل المعلومات الأساسية للحساب الجديد</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <InputField 
                                            icon={<User className="w-5 h-5 text-blue-600"/>} 
                                            name="displayName" 
                                            label="الاسم المعروض" 
                                            value={formData.displayName} 
                                            onChange={handleChange} 
                                            placeholder="اسم المستشفى أو المسعف" 
                                            required 
                                        />
                                    </div>
                                    <InputField 
                                        icon={<Mail className="w-5 h-5 text-blue-600"/>} 
                                        name="email" 
                                        type="email" 
                                        label="البريد الإلكتروني" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        placeholder="example@domain.com" 
                                        required 
                                        autoComplete="off" 
                                    />
                                    <InputField 
                                        icon={<Lock className="w-5 h-5 text-blue-600"/>} 
                                        name="password" 
                                        type="password" 
                                        label="كلمة المرور" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        placeholder="********" 
                                        required 
                                        autoComplete="new-password" 
                                    />
                                </div>
                            </div>

                            {role === 'hospital' && (
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                            <Hospital className="w-5 h-5 text-blue-600" />
                                            معلومات المستشفى
                                        </h3>
                                        <p className="text-gray-600 mt-1">أدخل الموقع الجغرافي للمستشفى</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <InputField 
                                                icon={<MapPin className="w-5 h-5 text-blue-600"/>} 
                                                name="formattedAddress" 
                                                label="العنوان" 
                                                value={formData.formattedAddress} 
                                                onChange={handleChange} 
                                                placeholder="مثال: الرياض، السعودية" 
                                            />
                                        </div>
                                        <InputField 
                                            icon={<MapPin className="w-5 h-5 text-blue-600"/>} 
                                            name="longitude" 
                                            type="number" 
                                            label="خط الطول (Longitude)" 
                                            value={formData.longitude} 
                                            onChange={handleChange} 
                                            placeholder="e.g., 46.6753" 
                                            step="any" 
                                            required
                                        />
                                        <InputField 
                                            icon={<MapPin className="w-5 h-5 text-blue-600"/>} 
                                            name="latitude" 
                                            type="number" 
                                            label="خط العرض (Latitude)" 
                                            value={formData.latitude} 
                                            onChange={handleChange} 
                                            placeholder="e.g., 24.7136" 
                                            step="any" 
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {role === 'paramedic' && (
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                            <Ambulance className="w-5 h-5 text-green-600" />
                                            معلومات المسعف
                                        </h3>
                                        <p className="text-gray-600 mt-1">أدخل المعلومات الخاصة بالمسعف</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField 
                                            icon={<Shield className="w-5 h-5 text-green-600"/>} 
                                            name="nationalId" 
                                            label="الرقم الوطني" 
                                            value={formData.nationalId} 
                                            onChange={handleChange} 
                                            placeholder="أدخل الرقم الوطني" 
                                            required 
                                        />
                                        <InputField 
                                            icon={<Ambulance className="w-5 h-5 text-green-600"/>} 
                                            name="associatedAmbulance" 
                                            label="سيارة الإسعاف" 
                                            value={formData.associatedAmbulance} 
                                            onChange={handleChange} 
                                            placeholder="مثال: إسعاف رقم 123" 
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <div className="border-t border-gray-200 pt-6">
                                <button 
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <PlusCircle className="w-6 h-6" />
                                    )}
                                    <span>
                                        {submitting ? 'جاري الإنشاء...' : `إنشاء حساب ${role === 'hospital' ? 'مستشفى' : 'مسعف'}`}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({ icon, label, ...props }: any) {
    return (
        <div className="space-y-2">
            <label htmlFor={props.name} className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1">
                {icon}
                <span>{label}</span>
                {props.required && <span className="text-red-500">*</span>}
            </label>
            <input 
                id={props.name}
                {...props} 
                className="w-full p-4 border-2 border-gray-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder:text-gray-500 font-medium transition-all duration-200 hover:border-gray-300"
            />
        </div>
    );
}

export default function CreateUserPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-700">جاري التحميل...</p>
                </div>
            </div>
        }>
            <CreateUserForm />
        </Suspense>
    );
}