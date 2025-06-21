'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import API from '@/lib/axios';
import Link from 'next/link';
import axios from 'axios';

// استيراد الأيقونات
import { 
    LayoutList, 
    ArrowLeft, 
    PlusCircle, 
    Eye, 
    Building, 
    Loader2,
    Palette,
    ServerCrash,
    Stethoscope,
    Heart,
    Brain,
    Bone,
    Baby,
    Zap,
    AlertCircle,
    BedDouble,
    Power,
    Users,
} from 'lucide-react';

// واجهات البيانات
interface Department {
    _id: string;
    name: string;
    icon: string;
    color: string;
    isAvailable: boolean;
    staff: any[];
    beds: {
        total: number;
        occupied: number;
    }
}

// دالة لجلب مكون الأيقونة بناءً على الاسم
const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      zap: Zap,
      heart: Heart,
      baby: Baby,
      bone: Bone,
      eye: Eye,
      brain: Brain,
      stethoscope: Stethoscope,
      building: Building
    };
    return icons[iconName] || Building; // أيقونة افتراضية
};

// المكون الرئيسي للصفحة
export default function ManageDepartmentsPage() {
    const { user } = useAuth();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [form, setForm] = useState({
        name: '',
        icon: 'building',
        color: '#3b82f6',
        description: '',
        isAvailable: true,
        beds: { total: 0, occupied: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // دالة لجلب الأقسام من الخادم
    const fetchDepartments = async () => {
        try {
            const res = await API.get('/hospitals/departments');
            setDepartments(res.data.data || []);
        } catch (err) {
            console.error('فشل في جلب الأقسام', err);
            setError('فشل في تحميل بيانات الأقسام. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDepartments();
        } else {
            setLoading(false);
        }
    }, [user]);

    // دالة لتحديث حقول النموذج
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (name === 'total' || name === 'occupied') {
            setForm(prev => ({
                ...prev,
                beds: {
                    ...prev.beds,
                    [name]: parseInt(value, 10) || 0
                }
            }));
        } else if (type === 'checkbox') {
             setForm(prev => ({
                ...prev,
                isAvailable: (e.target as HTMLInputElement).checked
            }));
        }
        else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // دالة لإرسال النموذج وإنشاء قسم جديد
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await API.post('/hospitals/departments', form);
            setForm({ name: '', icon: 'building', color: '#3b82f6', description: '', isAvailable: true, beds: { total: 0, occupied: 0 } });
            await fetchDepartments();
        } catch (err) {
            console.error('فشل في الإضافة', err);
            if(axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'فشل في إضافة القسم.');
            } else {
                setError('فشل في إضافة القسم.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir="rtl">
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
                
                {/* رأس الصفحة */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <LayoutList className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إدارة الأقسام الطبية</h1>
                                <p className="text-gray-600 text-sm sm:text-base mt-1">إنشاء وتعديل الأقسام الطبية في المستشفى</p>
                            </div>
                        </div>
                        <Link 
                            href="/dashboard" 
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 w-fit"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">العودة للوحة التحكم</span>
                        </Link>
                    </div>
                </div>

                {/* نموذج إضافة قسم جديد */}
                <div className="bg-white shadow-xl rounded-2xl border border-gray-100 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-l from-green-500 to-emerald-600 px-6 py-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <PlusCircle className="w-6 h-6" />
                            إضافة قسم جديد
                        </h2>
                    </div>
                    
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* اسم القسم */}
                                <div className="sm:col-span-2 lg:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        اسم القسم <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        id="name" 
                                        name="name" 
                                        placeholder="مثال: قسم الطوارئ والعناية المركزة" 
                                        value={form.name} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-right text-black placeholder-gray-500" 
                                        required 
                                    />
                                </div>
                                
                                {/* الأيقونة */}
                                <div>
                                    <label htmlFor="icon" className="block text-sm font-semibold text-gray-700 mb-2">الأيقونة</label>
                                    <select 
                                        id="icon" 
                                        name="icon" 
                                        value={form.icon} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-black"
                                    >
                                        <option value="building">🏢 مبنى (افتراضي)</option>
                                        <option value="heart">❤️ قلب</option>
                                        <option value="brain">🧠 دماغ</option>
                                        <option value="bone">🦴 عظام</option>
                                        <option value="baby">👶 أطفال</option>
                                        <option value="zap">⚡ طوارئ</option>
                                        <option value="eye">👁️ عيون</option>
                                        <option value="stethoscope">🩺 طب عام</option>
                                    </select>
                                </div>
                            </div>

                            {/* الوصف */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">وصف القسم</label>
                                <textarea 
                                    id="description" 
                                    name="description" 
                                    value={form.description} 
                                    onChange={handleChange} 
                                    rows={3} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-right resize-none text-black placeholder-gray-500" 
                                    placeholder="اكتب وصفاً موجزاً عن القسم وخدماته..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {/* إجمالي الأسرة */}
                                <div>
                                    <label htmlFor="total" className="block text-sm font-semibold text-gray-700 mb-2">
                                        <BedDouble className="w-4 h-4 inline ml-1" />
                                        إجمالي الأسرة
                                    </label>
                                    <input 
                                        id="total" 
                                        name="total" 
                                        type="number" 
                                        min="0" 
                                        value={form.beds.total} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-center text-black" 
                                    />
                                </div>
                                
                                {/* الأسرة المشغولة */}
                                <div>
                                    <label htmlFor="occupied" className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Users className="w-4 h-4 inline ml-1" />
                                        الأسرة المشغولة
                                    </label>
                                    <input 
                                        id="occupied" 
                                        name="occupied" 
                                        type="number" 
                                        min="0" 
                                        max={form.beds.total}
                                        value={form.beds.occupied} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-center text-black" 
                                    />
                                </div>
                                
                                {/* اللون المميز */}
                                <div>
                                    <label htmlFor="color" className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Palette className="w-4 h-4 inline ml-1" />
                                        اللون المميز
                                    </label>
                                    <div className="relative">
                                        <input 
                                            id="color" 
                                            name="color" 
                                            type="color" 
                                            value={form.color} 
                                            onChange={handleChange} 
                                            className="w-full h-12 border border-gray-300 rounded-xl cursor-pointer shadow-sm" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* حالة التوفر */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Power className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <div className="font-semibold text-gray-800">حالة التوفر</div>
                                            <div className="text-sm text-gray-600">تحديد ما إذا كان القسم متاحاً لاستقبال المرضى</div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            name="isAvailable" 
                                            className="sr-only" 
                                            checked={form.isAvailable} 
                                            onChange={handleChange} 
                                        />
                                        <div className={`w-14 h-8 rounded-full transition-all duration-200 ${
                                            form.isAvailable ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-1 ${
                                                form.isAvailable ? 'translate-x-7' : 'translate-x-1'
                                            }`}></div>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <span className="text-red-700 font-medium">{error}</span>
                                </div>
                            )}

                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                <button 
                                    disabled={submitting} 
                                    type="submit" 
                                    className="inline-flex items-center gap-3 bg-gradient-to-l from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <PlusCircle className="w-5 h-5" />
                                    )}
                                    {submitting ? 'جاري الإضافة...' : 'إضافة القسم'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* عرض الأقسام الحالية */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <LayoutList className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">الأقسام الحالية</h2>
                        <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {departments.length} قسم
                        </div>
                    </div>
                    
                    {departments.length === 0 && !loading ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <ServerCrash className="w-20 h-20 mx-auto text-gray-300 mb-6"/>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد أقسام حالياً</h3>
                            <p className="text-gray-500 mb-6">ابدأ بإضافة قسم جديد لإدارة أقسام المستشفى</p>
                            <button 
                                onClick={() => document.getElementById('name')?.focus()} 
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                            >
                                <PlusCircle className="w-5 h-5" />
                                إضافة أول قسم
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {departments.map((dept) => {
                                const IconComponent = getIconComponent(dept.icon);
                                const occupancyPercentage = dept.beds?.total ? Math.round((dept.beds.occupied / dept.beds.total) * 100) : 0;
                                
                                return (
                                    <div key={dept._id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:scale-105 border border-gray-100">
                                        {/* رأس البطاقة */}
                                        <div 
                                            className="p-6 text-white relative overflow-hidden"
                                            style={{ 
                                                background: `linear-gradient(135deg, ${dept.color} 0%, ${dept.color}dd 100%)` 
                                            }}
                                        >
                                            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white"></div>
                                                <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-white"></div>
                                            </div>
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                                        <IconComponent className="w-6 h-6 text-white" />
                                                    </div>
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                        dept.isAvailable 
                                                            ? 'bg-green-500 bg-opacity-20 text-green-100 border border-green-300' 
                                                            : 'bg-red-500 bg-opacity-20 text-red-100 border border-red-300'
                                                    }`}>
                                                        {dept.isAvailable ? 'متاح' : 'غير متاح'}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="font-bold text-lg mb-2 leading-tight">{dept.name}</h3>
                                                <div className="flex items-center gap-4 text-sm opacity-90">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        <span>{dept.staff?.length || 0} موظف</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <BedDouble className="w-4 h-4" />
                                                        <span>{dept.beds?.total || 0} سرير</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* محتوى البطاقة */}
                                        <div className="p-6">
                                            {/* معدل الإشغال */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold text-gray-700">معدل إشغال الأسرة</span>
                                                    <span className="text-sm font-bold text-gray-900">{occupancyPercentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full transition-all duration-500 ${
                                                            occupancyPercentage > 80 ? 'bg-red-500' : 
                                                            occupancyPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}
                                                        style={{ width: `${occupancyPercentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                    <span>{dept.beds?.occupied || 0} مشغولة</span>
                                                    <span>{(dept.beds?.total || 0) - (dept.beds?.occupied || 0)} متاحة</span>
                                                </div>
                                            </div>

                                            {/* زر التفاصيل */}
                                            <Link 
                                                href={`/departments/${dept._id}`} 
                                                className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>عرض التفاصيل والإدارة</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}