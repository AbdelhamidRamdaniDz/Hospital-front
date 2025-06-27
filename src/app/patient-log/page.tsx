'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import API from '@/lib/axios';
import Link from 'next/link';

// استيراد الأيقونات
import { 
    ClipboardList,
    ArrowLeft,
    Loader2,
    Search,
    User,
    ShieldCheck,
    ServerCrash,
    Check,
    X,
    Filter,
    Users,
    AlertCircle,
    CheckCircle2,
    XCircle,
    UserCheck,
    Calendar,
    Activity
} from 'lucide-react';

// واجهات البيانات
interface Patient {
    _id: string;
    firstName: string;
    lastName: string;
    currentCondition: string;
    status: 'pending' | 'confirmed' | 'treated' | 'rejected';
    createdAt: string;
    createdBy: {
        fullName: string;
    };
}

// مكون إحصائيات سريعة
const StatsCard = ({ title, value, icon: Icon, color, bgColor }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    bgColor: string;
}) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
            <div className={`p-4 rounded-2xl ${bgColor}`}>
                <Icon className={`w-8 h-8 ${color}`} />
            </div>
        </div>
    </div>
);

// مكون فلتر الحالة
const StatusFilter = ({ selectedStatus, onStatusChange }: {
    selectedStatus: string;
    onStatusChange: (status: string) => void;
}) => {
    const statusOptions = [
        { value: 'all', label: 'جميع الحالات', color: 'text-gray-600' },
        { value: 'pending', label: 'قيد الانتظار', color: 'text-yellow-600' },
        { value: 'confirmed', label: 'مؤكد', color: 'text-blue-600' },
        { value: 'treated', label: 'تم العلاج', color: 'text-green-600' },
        { value: 'rejected', label: 'مرفوض', color: 'text-red-600' }
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onStatusChange(option.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedStatus === option.value
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

// مكون رسالة التأكيد
const ConfirmationToast = ({ message, type, onClose }: {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}) => (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border-l-4 transition-all duration-300 ${
        type === 'success' 
            ? 'bg-green-50 border-green-400 text-green-800' 
            : 'bg-red-50 border-red-400 text-red-800'
    }`}>
        <div className="flex items-center gap-3">
            {type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
            ) : (
                <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-70">
                <X className="w-4 h-4" />
            </button>
        </div>
    </div>
);

// المكون الرئيسي للصفحة
export default function PatientLogPage() {
    const { user } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [updatingPatient, setUpdatingPatient] = useState<string | null>(null);

    const fetchPatientLog = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const res = await API.get('/hospitals/patient-log');
            const sortedPatients = (res.data.data || []).sort((a: Patient, b: Patient) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setPatients(sortedPatients);
        } catch (err) {
            console.error('فشل في جلب سجل المرضى', err);
            showToast('فشل في تحميل البيانات', 'error');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPatientLog();
    }, [fetchPatientLog]);

    // فلترة المرضى حسب البحث والحالة
    const filteredPatients = patients.filter(p => {
        const matchesSearch = `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             p.currentCondition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             p.createdBy?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // حساب الإحصائيات
    const stats = {
        total: patients.length,
        pending: patients.filter(p => p.status === 'pending').length,
        confirmed: patients.filter(p => p.status === 'confirmed').length,
        treated: patients.filter(p => p.status === 'treated').length,
        rejected: patients.filter(p => p.status === 'rejected').length
    };

    // دالة عرض رسالة التأكيد
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // دالة تحديث حالة المريض مع تحسينات UX
    const handleUpdateStatus = async (patientId: string, newStatus: 'confirmed' | 'rejected' | 'treated') => {
        setUpdatingPatient(patientId);
        try {
            await API.put(`/patients/${patientId}/status`, { status: newStatus });
            
            // تحديث الحالة في الواجهة فورًا
            setPatients(prevPatients => 
                prevPatients.map(p => 
                    p._id === patientId ? { ...p, status: newStatus } : p
                )
            );
            
            const statusMessages = {
                confirmed: 'تم تأكيد الحالة بنجاح',
                rejected: 'تم رفض الحالة',
                treated: 'تم تسجيل انتهاء العلاج'
            };
            
            showToast(statusMessages[newStatus], 'success');
        } catch (err) {
            console.error("فشل في تحديث الحالة", err);
            showToast("حدث خطأ أثناء تحديث حالة المريض", 'error');
        } finally {
            setUpdatingPatient(null);
        }
    };

    const getStatusChip = (status: Patient['status']) => {
        const statusConfig = {
            confirmed: { 
                text: 'مؤكد', 
                className: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200',
                icon: UserCheck
            },
            treated: { 
                text: 'تم العلاج', 
                className: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200',
                icon: CheckCircle2
            },
            rejected: { 
                text: 'مرفوض', 
                className: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200',
                icon: XCircle
            },
            pending: { 
                text: 'قيد الانتظار', 
                className: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-200',
                icon: AlertCircle
            }
        };
        
        return statusConfig[status] || statusConfig.pending;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="text-center">
                    <div className="relative">
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full mx-auto animate-pulse"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir="rtl">
            {/* رسالة التأكيد */}
            {toast && (
                <ConfirmationToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* رأس الصفحة */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                            <ClipboardList className="w-12 h-12 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                سجل الحالات الطارئة
                            </h1>
                            <p className="text-gray-600 mt-1 text-lg">إدارة ومتابعة الحالات المستقبلة من فرق الإسعاف</p>
                        </div>
                    </div>
                    <Link 
                        href="/dashboard" 
                        className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-all duration-200 bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="font-medium">العودة للوحة التحكم</span>
                    </Link>
                </header>

                {/* بطاقات الإحصائيات */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="إجمالي الحالات"
                        value={stats.total}
                        icon={Users}
                        color="text-gray-700"
                        bgColor="bg-gray-100"
                    />
                    <StatsCard
                        title="قيد الانتظار"
                        value={stats.pending}
                        icon={AlertCircle}
                        color="text-yellow-600"
                        bgColor="bg-yellow-100"
                    />
                    <StatsCard
                        title="مؤكدة"
                        value={stats.confirmed}
                        icon={UserCheck}
                        color="text-blue-600"
                        bgColor="bg-blue-100"
                    />
                    <StatsCard
                        title="تم العلاج"
                        value={stats.treated}
                        icon={CheckCircle2}
                        color="text-green-600"
                        bgColor="bg-green-100"
                    />
                </div>
                
                {/* المحتوى الرئيسي */}
                <main className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
                    {/* شريط التحكم */}
                    <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex items-center gap-3">
                                <Activity className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-800">
                                    السجل الطبي ({filteredPatients.length} حالة)
                                </h2>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                {/* البحث */}
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="بحث بالاسم، الحالة، أو المسعف..." 
                                        value={searchTerm} 
                                        onChange={(e) => setSearchTerm(e.target.value)} 
                                        className="w-full sm:w-80 pr-4 pl-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 bg-white shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* فلتر الحالة */}
                        <div className="mt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-700">فلترة حسب الحالة:</span>
                            </div>
                            <StatusFilter
                                selectedStatus={statusFilter}
                                onStatusChange={setStatusFilter}
                            />
                        </div>
                    </div>

                    {/* الجدول */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                                <tr>
                                    <th className="p-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                        معلومات المريض
                                    </th>
                                    <th className="p-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                        الحالة الطبية
                                    </th>
                                    <th className="p-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                        المسعف المسؤول
                                    </th>
                                    <th className="p-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                        تاريخ الاستقبال
                                    </th>
                                    <th className="p-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                                        الحالة
                                    </th>
                                    <th className="p-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                                        الإجراءات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient, index) => {
                                        const statusInfo = getStatusChip(patient.status);
                                        const StatusIcon = statusInfo.icon;
                                        const isUpdating = updatingPatient === patient._id;
                                        
                                        return (
                                            <tr 
                                                key={patient._id} 
                                                className={`hover:bg-blue-50 transition-all duration-200 ${
                                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                                }`}
                                            >
                                                {/* معلومات المريض */}
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
                                                            <User className="w-6 h-6 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-lg">
                                                                {patient.firstName} {patient.lastName}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                المريض #{patient._id.slice(-6)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                
                                                {/* الحالة الطبية */}
                                                <td className="p-6">
                                                    <div className="flex items-start gap-3">
                                                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                                        <p className="text-gray-800 font-medium leading-relaxed">
                                                            {patient.currentCondition}
                                                        </p>
                                                    </div>
                                                </td>
                                                
                                                {/* المسعف */}
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <ShieldCheck className="w-5 h-5 text-green-600" />
                                                        <span className="font-medium text-gray-800">
                                                            {patient.createdBy?.fullName || 'غير معروف'}
                                                        </span>
                                                    </div>
                                                </td>
                                                
                                                {/* التاريخ */}
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="w-5 h-5 text-gray-500" />
                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {new Date(patient.createdAt).toLocaleDateString('ar-EG', { 
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(patient.createdAt).toLocaleTimeString('ar-EG', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                
                                                {/* الحالة */}
                                                <td className="p-6 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${statusInfo.className}`}>
                                                            <StatusIcon className="w-4 h-4" />
                                                            {statusInfo.text}
                                                        </span>
                                                    </div>
                                                </td>
                                                
                                                {/* الإجراءات */}
                                                <td className="p-6">
                                                    {patient.status === 'pending' ? (
                                                        <div className="flex justify-center gap-3">
                                                            <button
                                                                onClick={() => handleUpdateStatus(patient._id, 'confirmed')}
                                                                disabled={isUpdating}
                                                                className="group relative p-3 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="تأكيد الحالة"
                                                            >
                                                                {isUpdating ? (
                                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                                ) : (
                                                                    <Check className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(patient._id, 'rejected')}
                                                                disabled={isUpdating}
                                                                className="group relative p-3 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="رفض الحالة"
                                                            >
                                                                {isUpdating ? (
                                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                                ) : (
                                                                    <X className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    ) : patient.status === 'confirmed' ? (
                                                        <div className="flex justify-center">
                                                            <button
                                                                onClick={() => handleUpdateStatus(patient._id, 'treated')}
                                                                disabled={isUpdating}
                                                                className="group relative px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                                                title="تسجيل انتهاء العلاج"
                                                            >
                                                                {isUpdating ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                        <span>جاري التحديث...</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <CheckCircle2 className="w-4 h-4" />
                                                                        <span>انتهاء العلاج</span>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <span className="text-gray-400 font-medium">مكتملة</span>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-20">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                                    <ServerCrash className="w-12 h-12 text-gray-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-600 mb-2">
                                                    لا توجد سجلات لعرضها
                                                </h3>
                                                <p className="text-gray-500 max-w-md text-center">
                                                    {searchTerm || statusFilter !== 'all' 
                                                        ? 'لم يتم العثور على نتائج تطابق البحث أو الفلتر المحدد'
                                                        : 'لم يتم استقبال أي حالات طارئة بعد'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}