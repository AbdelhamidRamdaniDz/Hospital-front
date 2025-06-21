'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import API from '@/lib/axios';
import Link from 'next/link';
import axios from 'axios';

// استيراد الأيقونات
import {
    UserPlus,
    ArrowLeft,
    Building,
    Stethoscope,
    Briefcase,
    Loader2,
    CheckCircle,
    AlertCircle,
    Users,
    Calendar,
    Clock,
    Star,
    ChevronRight,
    User
} from 'lucide-react';

// واجهات البيانات
interface Department {
    _id: string;
    name: string;
}

interface Doctor {
    _id: string;
    fullName: string;
}

// المكون الرئيسي للصفحة
export default function AddStaffPage() {
    const { user } = useAuth();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedRole, setSelectedRole] = useState('مناوب');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    const staffRoles = [
        { value: 'مناوب', label: 'مناوب', icon: Clock, color: 'bg-blue-100 text-blue-800 border-blue-200' },
        { value: 'رئيس قسم', label: 'رئيس قسم', icon: Star, color: 'bg-purple-100 text-purple-800 border-purple-200' },
        { value: 'تحت الطلب', label: 'تحت الطلب', icon: Calendar, color: 'bg-orange-100 text-orange-800 border-orange-200' },
        { value: 'أخصائي', label: 'أخصائي', icon: Users, color: 'bg-green-100 text-green-800 border-green-200' }
    ];

    const steps = [
        { id: 1, title: 'اختيار القسم', icon: Building, description: 'حدد القسم المطلوب' },
        { id: 2, title: 'اختيار الطبيب', icon: Stethoscope, description: 'اختر الطبيب المناسب' },
        { id: 3, title: 'تحديد الدور', icon: Briefcase, description: 'حدد الدور الوظيفي' }
    ];

    // دالة لجلب البيانات الأولية (الأقسام والأطباء)
    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const [deptsRes, docsRes] = await Promise.all([
                    API.get('/hospitals/departments'),
                    API.get('/hospitals/doctors')
                ]);
                setDepartments(deptsRes.data.data || []);
                setDoctors(docsRes.data.data || []);
            } catch (err) {
                console.error('فشل في جلب البيانات', err);
                setError('فشل في تحميل بيانات الأقسام أو الأطباء.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // دالة لإرسال النموذج
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDept || !selectedDoctor) {
            setError('يرجى اختيار قسم وطبيب.');
            return;
        }
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const body = {
            doctorId: selectedDoctor,
            roleInDepartment: selectedRole,
            onDuty: true // القيمة الافتراضية عند الإضافة
        };

        try {
            await API.post(`/hospitals/departments/${selectedDept}/staff`, body);
            setSuccess(`تمت إضافة الطبيب بنجاح إلى القسم المحدد.`);
            // إعادة تعيين الحقول
            setSelectedDoctor('');
            setSelectedRole('مناوب');
            setCurrentStep(1);
            setTimeout(() => setSuccess(null), 4000);
        } catch (err) {
            console.error('فشل في الإضافة', err);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'فشل في إضافة الطبيب.');
            } else {
                setError('حدث خطأ غير متوقع.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const getStepStatus = (stepId: number) => {
        if (stepId < currentStep) return 'completed';
        if (stepId === currentStep) return 'current';
        return 'upcoming';
    };

    const canProceedToStep = (stepId: number) => {
        if (stepId === 1) return true;
        if (stepId === 2) return selectedDept;
        if (stepId === 3) return selectedDept && selectedDoctor;
        return false;
    };

    const getSelectedDepartmentName = () => {
        return departments.find(d => d._id === selectedDept)?.name || '';
    };

    const getSelectedDoctorName = () => {
        return doctors.find(d => d._id === selectedDoctor)?.fullName || '';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
            <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                
                {/* رأس الصفحة */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-4 rounded-2xl shadow-lg border border-blue-100">
                            <UserPlus className="w-10 h-10 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">إضافة طاقم للقسم</h1>
                            <p className="text-gray-600 text-lg">توزيع الأطباء على الأقسام وتحديد أدوارهم بسهولة</p>
                        </div>
                    </div>
                    <Link 
                        href="/dashboard" 
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-blue-600 transition-all bg-white rounded-xl hover:shadow-lg border border-gray-200 hover:border-blue-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">العودة للوحة التحكم</span>
                    </Link>
                </div>

                {/* شريط التقدم */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => {
                                const status = getStepStatus(step.id);
                                const IconComponent = step.icon;
                                
                                return (
                                    <div key={step.id} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center">
                                            <button
                                                onClick={() => canProceedToStep(step.id) && setCurrentStep(step.id)}
                                                disabled={!canProceedToStep(step.id)}
                                                className={`
                                                    w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 mb-3
                                                    ${status === 'completed' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 
                                                      status === 'current' ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-100' : 
                                                      'bg-gray-100 text-gray-400 border-2 border-gray-200'}
                                                    ${canProceedToStep(step.id) ? 'cursor-pointer hover:shadow-xl hover:scale-105' : 'cursor-not-allowed'}
                                                `}
                                            >
                                                {status === 'completed' ? (
                                                    <CheckCircle className="w-8 h-8" />
                                                ) : (
                                                    <IconComponent className="w-8 h-8" />
                                                )}
                                            </button>
                                            <div className="text-center">
                                                <h3 className={`font-bold text-lg mb-1 ${
                                                    status === 'current' ? 'text-blue-600' : 
                                                    status === 'completed' ? 'text-green-600' : 'text-gray-500'
                                                }`}>
                                                    {step.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">{step.description}</p>
                                            </div>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`h-1 flex-1 mx-8 rounded-full transition-colors duration-300 ${
                                                status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                                            }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* النموذج الرئيسي */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">{currentStep}</span>
                                    </div>
                                    {steps.find(s => s.id === currentStep)?.title}
                                </h2>
                                <p className="text-blue-100 mt-2">
                                    {steps.find(s => s.id === currentStep)?.description}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                
                                {/* الخطوة 1: اختيار القسم */}
                                {currentStep === 1 && (
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-xl font-bold text-gray-700 mb-6">
                                            <Building className="w-7 h-7 text-blue-500"/>
                                            اختر القسم المطلوب
                                        </label>
                                        
                                        {departments.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500 text-lg">لا توجد أقسام متاحة</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {departments.map(dept => (
                                                    <button
                                                        key={dept._id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedDept(dept._id);
                                                            setCurrentStep(2);
                                                        }}
                                                        className={`
                                                            p-6 rounded-xl border-2 transition-all duration-300 text-right group
                                                            ${selectedDept === dept._id ? 
                                                                'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100 scale-105' : 
                                                                'border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-right">
                                                                <h3 className="font-bold text-gray-800 text-lg mb-1">{dept.name}</h3>
                                                                <p className="text-sm text-gray-500">انقر للاختيار</p>
                                                            </div>
                                                            <div className={`p-3 rounded-lg transition-colors ${
                                                                selectedDept === dept._id ? 'bg-blue-500' : 'bg-gray-100 group-hover:bg-blue-100'
                                                            }`}>
                                                                <Building className={`w-6 h-6 ${
                                                                    selectedDept === dept._id ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                                                                }`} />
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* الخطوة 2: اختيار الطبيب */}
                                {currentStep === 2 && (
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-xl font-bold text-gray-700 mb-6">
                                            <Stethoscope className="w-7 h-7 text-green-500"/>
                                            اختر الطبيب
                                        </label>

                                        {doctors.length === 0 ? (
                                            <div className="text-center py-12">
                                                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500 text-lg">لا يوجد أطباء متاحون</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {doctors.map(doc => (
                                                    <button
                                                        key={doc._id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedDoctor(doc._id);
                                                            setCurrentStep(3);
                                                        }}
                                                        className={`
                                                            p-6 rounded-xl border-2 transition-all duration-300 text-right group
                                                            ${selectedDoctor === doc._id ? 
                                                                'border-green-500 bg-green-50 shadow-lg shadow-green-100 scale-105' : 
                                                                'border-gray-200 hover:border-green-300 hover:bg-green-50 hover:shadow-md'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-right">
                                                                <h3 className="font-bold text-gray-800 text-lg mb-1">{doc.fullName}</h3>
                                                                <p className="text-sm text-gray-500">انقر للاختيار</p>
                                                            </div>
                                                            <div className={`p-3 rounded-lg transition-colors ${
                                                                selectedDoctor === doc._id ? 'bg-green-500' : 'bg-gray-100 group-hover:bg-green-100'
                                                            }`}>
                                                                <Stethoscope className={`w-6 h-6 ${
                                                                    selectedDoctor === doc._id ? 'text-white' : 'text-gray-400 group-hover:text-green-500'
                                                                }`} />
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* الخطوة 3: تحديد الدور */}
                                {currentStep === 3 && (
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-xl font-bold text-gray-700 mb-6">
                                            <Briefcase className="w-7 h-7 text-purple-500"/>
                                            حدد الدور الوظيفي
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {staffRoles.map(role => {
                                                const IconComponent = role.icon;
                                                return (
                                                    <button
                                                        key={role.value}
                                                        type="button"
                                                        onClick={() => setSelectedRole(role.value)}
                                                        className={`
                                                            p-6 rounded-xl border-2 transition-all duration-300 text-right group
                                                            ${selectedRole === role.value ? 
                                                                'border-purple-500 bg-purple-50 shadow-lg shadow-purple-100 scale-105' : 
                                                                'border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-right">
                                                                <h3 className="font-bold text-gray-800 text-lg mb-2">{role.label}</h3>
                                                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${role.color}`}>
                                                                    {role.label}
                                                                </span>
                                                            </div>
                                                            <div className={`p-3 rounded-lg transition-colors ${
                                                                selectedRole === role.value ? 'bg-purple-500' : 'bg-gray-100 group-hover:bg-purple-100'
                                                            }`}>
                                                                <IconComponent className={`w-6 h-6 ${
                                                                    selectedRole === role.value ? 'text-white' : 'text-gray-400 group-hover:text-purple-500'
                                                                }`} />
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* رسائل الخطأ والنجاح */}
                                {error && (
                                    <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 border border-red-200 animate-pulse">
                                        <AlertCircle className="w-6 h-6 flex-shrink-0" />
                                        <p className="font-medium">{error}</p>
                                    </div>
                                )}
                                {success && (
                                    <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-200 animate-pulse">
                                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                                        <p className="font-medium">{success}</p>
                                    </div>
                                )}

                                {/* أزرار التنقل */}
                                <div className="flex justify-between pt-6 border-t border-gray-100">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(currentStep - 1)}
                                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                            السابق
                                        </button>
                                    )}
                                    
                                    {currentStep === 3 ? (
                                        <button
                                            type="submit"
                                            disabled={submitting || !selectedDept || !selectedDoctor}
                                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 mr-auto"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    جاري الإضافة...
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="w-6 h-6" />
                                                    إضافة إلى طاقم القسم
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => currentStep < 3 && canProceedToStep(currentStep + 1) && setCurrentStep(currentStep + 1)}
                                            disabled={!canProceedToStep(currentStep + 1)}
                                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mr-auto"
                                        >
                                            التالي
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* بطاقة الملخص */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                ملخص الاختيار
                            </h3>
                            
                            <div className="space-y-4">
                                {/* القسم المحدد */}
                                <div className={`p-4 rounded-xl border-2 transition-all ${
                                    selectedDept ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Building className={`w-5 h-5 ${selectedDept ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <span className="font-medium text-gray-700">القسم</span>
                                    </div>
                                    <p className={`font-bold ${selectedDept ? 'text-blue-800' : 'text-gray-400'}`}>
                                        {selectedDept ? getSelectedDepartmentName() : 'لم يتم الاختيار بعد'}
                                    </p>
                                </div>

                                {/* الطبيب المحدد */}
                                <div className={`p-4 rounded-xl border-2 transition-all ${
                                    selectedDoctor ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Stethoscope className={`w-5 h-5 ${selectedDoctor ? 'text-green-500' : 'text-gray-400'}`} />
                                        <span className="font-medium text-gray-700">الطبيب</span>
                                    </div>
                                    <p className={`font-bold ${selectedDoctor ? 'text-green-800' : 'text-gray-400'}`}>
                                        {selectedDoctor ? getSelectedDoctorName() : 'لم يتم الاختيار بعد'}
                                    </p>
                                </div>

                                {/* الدور المحدد */}
                                <div className="p-4 rounded-xl border-2 bg-purple-50 border-purple-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Briefcase className="w-5 h-5 text-purple-500" />
                                        <span className="font-medium text-gray-700">الدور</span>
                                    </div>
                                    <p className="font-bold text-purple-800">{selectedRole}</p>
                                </div>
                            </div>

                            {/* إحصائيات سريعة */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-600">{departments.length}</p>
                                        <p className="text-sm text-gray-600">قسم متاح</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">{doctors.length}</p>
                                        <p className="text-sm text-gray-600">طبيب متاح</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}