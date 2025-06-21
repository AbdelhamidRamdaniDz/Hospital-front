'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import API from '@/lib/axios';
import Link from 'next/link';
import axios from 'axios';

// استيراد الأيقونات
import { 
    ArrowLeft,
    Loader2,
    CheckCircle,
    AlertCircle,
    BedDouble,
    Siren,
    Plus,
    X,
    ServerCrash,
    Hospital,
    Save
} from 'lucide-react';

// واجهات البيانات المحسنة
interface BedStatus {
    total: number;
    occupied: number;
}

// واجهة بيانات حالة المستشفى
interface HospitalStatus {
    isERAvailable: boolean;
    availableBeds: Record<string, BedStatus>;
}

// واجهة بيانات القسم
interface Department {
    _id: string;
    name: string;
    beds: BedStatus;
}

// المكون الرئيسي للصفحة
export default function UpdateStatusPage() {
    const { user } = useAuth();
    const [status, setStatus] = useState<HospitalStatus>({
        isERAvailable: true,
        availableBeds: {}
    });
    const [newUnitName, setNewUnitName] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // دالة لجلب الحالة الحالية والأقسام
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const [statusRes, deptsRes] = await Promise.all([
                    API.get('/hospitals/status').catch(err => {
                        if (err.response && err.response.status === 404) return null;
                        throw err;
                    }),
                    API.get('/hospitals/departments')
                ]);

                const departments: Department[] = deptsRes.data.data || [];
                const currentStatus = statusRes ? statusRes.data.data : null;

                const initialBeds: Record<string, BedStatus> = { ...currentStatus?.availableBeds };
                
                departments.forEach(dept => {
                    if (!initialBeds[dept.name]) {
                        initialBeds[dept.name] = dept.beds || { total: 0, occupied: 0 };
                    }
                });

                setStatus({
                    isERAvailable: currentStatus?.isERAvailable ?? true,
                    availableBeds: initialBeds
                });

            } catch (err) {
                 console.error('فشل في جلب البيانات', err);
                 setError('فشل في تحميل البيانات الأولية من الخادم.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [user]);

    // دالة لتحديث حقول النموذج
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [unitName, property] = name.split('.');
            setStatus(prev => ({
                ...prev,
                availableBeds: {
                    ...prev.availableBeds,
                    [unitName]: {
                        ...prev.availableBeds[unitName],
                        [property]: parseInt(value, 10) >= 0 ? parseInt(value, 10) : 0
                    }
                }
            }));
        } else {
            setStatus(prev => ({
                ...prev,
                [name]: value === 'true'
            }));
        }
    };

    // دالة لإضافة وحدة جديدة
    const handleAddUnit = () => {
        if (newUnitName.trim() && !status.availableBeds[newUnitName.trim()]) {
            setStatus(prev => ({
                ...prev,
                availableBeds: {
                    ...prev.availableBeds,
                    [newUnitName.trim()]: { total: 0, occupied: 0 }
                }
            }));
            setNewUnitName('');
        }
    };
    
    // دالة لحذف وحدة
    const handleRemoveUnit = (unitName: string) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف وحدة "${unitName}"؟`)) {
            setStatus(prev => {
                const newBeds = { ...prev.availableBeds };
                delete newBeds[unitName];
                return { ...prev, availableBeds: newBeds };
            });
        }
    };

    // دالة لإرسال التحديثات
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        
        try {
            await API.put('/hospitals/status', status);
            setSuccess('تم تحديث حالة المستشفى بنجاح!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('فشل في التحديث', err);
            const errorMsg = axios.isAxiosError(err) && err.response ? err.response.data.message : 'فشل في تحديث الحالة.';
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-semibold text-gray-800">جاري تحميل البيانات</p>
                        <p className="text-gray-600">يرجى الانتظار قليلاً...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-6xl">
                
                {/* رأس الصفحة */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                                <Hospital className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                                    تحديث حالة المستشفى
                                </h1>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    إدارة جاهزية الأقسام والوحدات الطبية المختلفة
                                </p>
                            </div>
                        </div>
                        <Link 
                            href="/dashboard" 
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>العودة للوحة التحكم</span>
                        </Link>
                    </div>
                </div>
                
                {/* شريط الإشعارات */}
                {success && (
                    <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 p-4 rounded-xl shadow-sm animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="font-semibold">{success}</p>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-100 p-1 rounded-full">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <p className="font-semibold">{error}</p>
                        </div>
                    </div>
                )}

                {/* النموذج الرئيسي */}
                <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
                        
                        {/* قسم الطوارئ */}
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-red-100 p-2 rounded-lg">
                                    <Siren className="w-6 h-6 text-red-600"/>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">حالة قسم الطوارئ</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <RadioCard 
                                    name="isERAvailable" 
                                    id="er-available" 
                                    value="true" 
                                    checked={status.isERAvailable} 
                                    onChange={handleChange} 
                                    label="متاح لاستقبال الحالات" 
                                    description="القسم جاهز لاستقبال المرضى"
                                    icon={<CheckCircle className="w-6 h-6 text-green-500" />}
                                    variant="success"
                                />
                                <RadioCard 
                                    name="isERAvailable" 
                                    id="er-unavailable" 
                                    value="false" 
                                    checked={!status.isERAvailable} 
                                    onChange={handleChange} 
                                    label="غير متاح حاليًا" 
                                    description="القسم مغلق مؤقتًا"
                                    icon={<AlertCircle className="w-6 h-6 text-red-500" />}
                                    variant="danger"
                                />
                            </div>
                        </div>

                        {/* قسم الوحدات والأسرة */}
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <BedDouble className="w-6 h-6 text-blue-600"/>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">إدارة الوحدات والأسرة</h2>
                            </div>
                            
                            {Object.keys(status.availableBeds).length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    {Object.entries(status.availableBeds).map(([unitName, unitStatus]) => (
                                        <BedInputGroup
                                            key={unitName}
                                            label={unitName}
                                            totalName={`${unitName}.total`}
                                            occupiedName={`${unitName}.occupied`}
                                            totalValue={unitStatus.total}
                                            occupiedValue={unitStatus.occupied}
                                            onChange={handleChange}
                                            onRemove={() => handleRemoveUnit(unitName)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 mb-8">
                                    <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200">
                                        <ServerCrash className="w-12 h-12 mx-auto text-gray-300 mb-4"/>
                                        <h3 className="text-lg font-semibold text-gray-500 mb-2">لم يتم إضافة وحدات بعد</h3>
                                        <p className="text-gray-400">ابدأ بإضافة الأقسام والوحدات الطبية</p>
                                    </div>
                                </div>
                            )}

                            {/* إضافة وحدة جديدة */}
                            <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
                                <label className="block text-lg font-semibold text-gray-700 mb-4">
                                    إضافة وحدة أو قسم جديد
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input 
                                        type="text" 
                                        value={newUnitName}
                                        onChange={(e) => setNewUnitName(e.target.value)}
                                        placeholder="مثال: قسم الولادة، وحدة العناية المركزة، أجهزة التنفس..."
                                        className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddUnit()}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddUnit}
                                        disabled={!newUnitName.trim()}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 justify-center"
                                    >
                                        <Plus className="w-4 h-4"/>
                                        <span className="hidden sm:inline">إضافة</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* زر الحفظ */}
                        <div className="p-6 sm:p-8 bg-gray-50">
                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-3"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>جاري التحديث...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-6 h-6" />
                                        <span>حفظ وتحديث الحالة</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// مكون بطاقة الاختيار المحسن
function RadioCard({ name, id, value, checked, onChange, label, description, icon, variant }: any) {
    const baseClasses = "flex-1 p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md";
    const variantClasses = {
        success: checked 
            ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-green-200 shadow-lg' 
            : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50',
        danger: checked 
            ? 'border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-red-200 shadow-lg' 
            : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50'
    };

    return (
        <label htmlFor={id} className={`${baseClasses} ${variantClasses[variant]}`}>
            <input type="radio" name={name} id={id} value={value} checked={checked} onChange={onChange} className="sr-only"/>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="font-bold text-gray-800 mb-1">{label}</div>
                    <div className="text-sm text-gray-600">{description}</div>
                </div>
            </div>
        </label>
    );
}

// مكون مجموعة إدخال الأسرة المحسن
function BedInputGroup({ label, totalName, occupiedName, totalValue, occupiedValue, onChange, onRemove }: any) {
    const available = totalValue - occupiedValue;
    const occupancyRate = totalValue > 0 ? (occupiedValue / totalValue) * 100 : 0;
    
    return (
        <div className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
            {/* زر الحذف */}
            <button 
                type="button" 
                onClick={onRemove} 
                className="absolute top-3 left-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="حذف الوحدة"
            >
                <X className="w-4 h-4"/>
            </button>
            
            {/* عنوان الوحدة */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{label}</h3>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600 font-semibold">متاح: {available}</span>
                    <span className="text-gray-500">معدل الإشغال: {occupancyRate.toFixed(0)}%</span>
                </div>
            </div>
            
            {/* شريط التقدم */}
            <div className="mb-4">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-300 ${
                            occupancyRate > 90 ? 'bg-red-500' : 
                            occupancyRate > 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                    ></div>
                </div>
            </div>
            
            {/* حقول الإدخال */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor={totalName} className="block text-sm font-medium text-gray-700 mb-2">
                        العدد الإجمالي
                    </label>
                    <input 
                        id={totalName} 
                        name={totalName} 
                        type="number" 
                        min="0" 
                        value={totalValue} 
                        onChange={onChange} 
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-center font-semibold text-lg" 
                    />
                </div>
                <div>
                    <label htmlFor={occupiedName} className="block text-sm font-medium text-gray-700 mb-2">
                        المشغول حاليًا
                    </label>
                    <input 
                        id={occupiedName} 
                        name={occupiedName} 
                        type="number" 
                        min="0" 
                        max={totalValue}
                        value={occupiedValue} 
                        onChange={onChange} 
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-center font-semibold text-lg" 
                    />
                </div>
            </div>
        </div>
    );
}