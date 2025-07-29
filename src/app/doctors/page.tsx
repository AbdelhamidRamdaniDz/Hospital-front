'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import API from '@/lib/axios';
import Link from 'next/link';
import axios from 'axios';

import { 
    Stethoscope, 
    ArrowLeft, 
    PlusCircle, 
    User, 
    Loader2,
    Trash2,
    Edit,
    Phone,
    ShieldCheck,
    Search,
    UserCheck,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';

interface Doctor {
    _id: string;
    fullName: string;
    specialty: string;
    nationalCode: string;
    phone: string;
}

export default function ManageDoctorsPage() {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [form, setForm] = useState({ fullName: '', specialty: '', nationalCode: '', phone: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    // const [showMobileMenu, setShowMobileMenu] = useState(false);

    const fetchDoctors = async () => {
        try {
            const res = await API.get('/hospitals/doctors');
            const doctorsData = res.data.data || res.data || [];
            setDoctors(doctorsData);
            setFilteredDoctors(doctorsData);
        } catch (err) {
            console.error('فشل في جلب الأطباء', err);
            setError('فشل في تحميل بيانات الأطباء.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDoctors();
        } else {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const filtered = doctors.filter(doctor =>
            doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.nationalCode.includes(searchTerm)
        );
        setFilteredDoctors(filtered);
    }, [searchTerm, doctors]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        
        try {
            await API.post('/hospitals/doctors', form);
            setForm({ fullName: '', specialty: '', nationalCode: '', phone: '' });
            setSuccess('تم إضافة الطبيب بنجاح!');
            setShowForm(false);
            await fetchDoctors(); 
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('فشل في الإضافة', err);
            if(axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'فشل في إضافة الطبيب. قد يكون الرقم الوطني مكرر.');
            } else {
                setError('فشل في إضافة الطبيب.');
            }
        } finally {
            setSubmitting(false);
        }
    };
    
    const handleDelete = (id: string) => {
        alert(`سيتم حذف الطبيب صاحب المعرف: ${id}. هذه الميزة قيد التطوير.`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600 animate-spin" />
                        <div className="absolute inset-0 h-8 w-8 sm:h-12 sm:w-12 border-4 border-blue-200 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-base sm:text-lg font-medium text-gray-700 text-center">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir="rtl">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
                
                <div className="mb-6 sm:mb-8">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-blue-100 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-16 sm:w-32 h-16 sm:h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -ml-8 sm:-ml-16 -mt-8 sm:-mt-16"></div>
                        <div className="absolute bottom-0 right-0 w-12 sm:w-24 h-12 sm:h-24 bg-gradient-to-tl from-indigo-100 to-transparent rounded-full -mr-6 sm:-mr-12 -mb-6 sm:-mb-12"></div>
                        
                        <div className="relative flex flex-col space-y-4 sm:space-y-6 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                                <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg w-fit">
                                    <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                                        إدارة الأطباء
                                    </h1>
                                    <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                                        إضافة وتعديل بيانات الأطباء في المستشفى
                                    </p>
                                </div>
                            </div>
                            
                            <Link 
                                href="/dashboard"
                                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-md group text-sm sm:text-base"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                العودة للوحة التحكم
                            </Link>
                        </div>
                    </div>
                </div>

                {success && (
                    <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start sm:items-center space-x-3 space-x-reverse animate-fade-in">
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <p className="text-green-800 font-medium text-sm sm:text-base">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start sm:items-center space-x-3 space-x-reverse">
                        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <p className="text-red-800 font-medium text-sm sm:text-base">{error}</p>
                    </div>
                )}

                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
                    
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div 
                                className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-indigo-600 cursor-pointer"
                                onClick={() => setShowForm(!showForm)}
                            >
                                <div className="flex items-center justify-between text-white">
                                    <div className="flex items-center space-x-3 space-x-reverse">
                                        <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                                        <h2 className="text-lg sm:text-xl font-bold">إضافة طبيب جديد</h2>
                                    </div>
                                    <div className={`transform transition-transform duration-200 ${showForm ? 'rotate-45' : ''}`}>
                                        <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`transition-all duration-300 overflow-hidden ${showForm ? 'max-h-screen' : 'max-h-0'}`}>
                                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                الاسم الكامل
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={form.fullName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                                placeholder="أدخل الاسم الكامل"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                التخصص
                                            </label>
                                            <input
                                                type="text"
                                                name="specialty"
                                                value={form.specialty}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                                placeholder="أدخل التخصص"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                الرقم الوطني
                                            </label>
                                            <input
                                                type="text"
                                                name="nationalCode"
                                                value={form.nationalCode}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                                placeholder="أدخل الرقم الوطني"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                رقم الهاتف
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                                placeholder="أدخل رقم الهاتف"
                                            />
                                        </div>
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-sm sm:text-base"
                                    >
                                        <div className="flex items-center justify-center space-x-2 space-x-reverse">
                                            {submitting ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />}
                                            <span>{submitting ? 'جاري الإضافة...' : 'إضافة طبيب'}</span>
                                        </div>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center space-x-3 space-x-reverse">
                                        <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                            الأطباء الحاليون ({filteredDoctors.length})
                                        </h2>
                                    </div>
                                    
                                    <div className="relative w-full sm:w-80">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="البحث في الأطباء..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pr-3 sm:pr-4 pl-10 sm:pl-12 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 sm:p-6">
                                {filteredDoctors.length === 0 ? (
                                    <div className="text-center py-8 sm:py-12">
                                        <User className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-base sm:text-lg">
                                            {searchTerm ? 'لا توجد نتائج للبحث' : 'لا يوجد أطباء مسجلون حالياً'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 sm:space-y-6">
                                        {filteredDoctors.map((doc) => (
                                            <div key={doc._id} className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden">
                                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                                                
                                                <div className="p-4 sm:p-6">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                                                        <div className="flex items-start space-x-3 sm:space-x-5 space-x-reverse flex-1">
                                                            <div className="relative flex-shrink-0">
                                                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg ring-2 sm:ring-4 ring-blue-100">
                                                                    {doc.fullName.charAt(0)}
                                                                </div>
                                                                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white"></div>
                                                            </div>
                                                            
                                                            <div className="flex-1 min-w-0">
                                                                <div className="mb-3">
                                                                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-1 truncate">
                                                                        {doc.fullName}
                                                                    </h3>
                                                                    <div className="inline-block px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full">
                                                                        طبيب مختص
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="space-y-2 sm:space-y-3">
                                                                    <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse p-2 sm:p-3 bg-blue-50 rounded-lg sm:rounded-xl">
                                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                                                                            <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                                                        </div>
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="text-xs text-gray-500 mb-1">التخصص</p>
                                                                            <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{doc.specialty}</p>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse p-2 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl">
                                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                                                                            <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                                                        </div>
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="text-xs text-gray-500 mb-1">الرقم الوطني</p>
                                                                            <p className="font-bold text-gray-900 text-sm sm:text-base">{doc.nationalCode}</p>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {doc.phone && (
                                                                        <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse p-2 sm:p-3 bg-purple-50 rounded-lg sm:rounded-xl">
                                                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                                                                                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                                                            </div>
                                                                            <div className="min-w-0 flex-1">
                                                                                <p className="text-xs text-gray-500 mb-1">رقم الهاتف</p>
                                                                                <p className="font-bold text-gray-900 text-sm sm:text-base">{doc.phone}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 space-x-reverse sm:opacity-0 sm:group-hover:opacity-100 sm:transition-all sm:duration-300 sm:translate-x-4 sm:group-hover:translate-x-0 justify-end sm:justify-start">
                                                            <button 
                                                                onClick={() => alert('ميزة التعديل قيد التطوير')} 
                                                                className="p-2 sm:p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110 shadow-md"
                                                                title="تعديل بيانات الطبيب"
                                                            >
                                                                <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(doc._id)} 
                                                                className="p-2 sm:p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110 shadow-md"
                                                                title="حذف الطبيب"
                                                            >
                                                                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="absolute bottom-0 left-0 w-16 sm:w-32 h-16 sm:h-32 bg-gradient-to-tr from-blue-50 to-transparent rounded-full -ml-8 sm:-ml-16 -mb-8 sm:-mb-16 opacity-50"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}