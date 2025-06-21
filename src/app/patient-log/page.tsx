'use client';
import { useEffect, useState } from 'react';
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
    Clock,
    ShieldCheck,
    ServerCrash
} from 'lucide-react';

// واجهات البيانات
interface Patient {
    _id: string;
    firstName: string;
    lastName: string;
    currentCondition: string;
    status: 'pending' | 'confirmed' | 'treated';
    createdAt: string;
    createdBy: {
        fullName: string;
    };
}

// المكون الرئيسي للصفحة
export default function PatientLogPage() {
    const { user } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // دالة لجلب سجل المرضى
    useEffect(() => {
        const fetchPatientLog = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const res = await API.get('/hospitals/patient-log');
                const sortedPatients = (res.data.data || []).sort((a: Patient, b: Patient) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setPatients(sortedPatients);
                setFilteredPatients(sortedPatients);
            } catch (err) {
                console.error('فشل في جلب سجل المرضى', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientLog();
    }, [user]);

    // دالة للبحث في السجل
    useEffect(() => {
        const results = patients.filter(p =>
            p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.currentCondition.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPatients(results);
    }, [searchTerm, patients]);

    // دالة لتنسيق لون الحالة
    const getStatusChip = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'treated':
                return 'bg-green-100 text-green-800';
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-lg font-medium text-gray-700">جاري تحميل سجل المرضى...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-md border">
                           <ClipboardList className="w-10 h-10 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">سجل الحالات الطارئة</h1>
                            <p className="text-gray-500">عرض جميع الحالات المستقبلة من فرق الإسعاف.</p>
                        </div>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-lg border shadow-sm hover:shadow-md">
                        <ArrowLeft className="w-5 h-5" />
                        <span>العودة للوحة التحكم</span>
                    </Link>
                </header>
                
                <main className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-700">إجمالي الحالات: {filteredPatients.length}</h2>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="بحث بالاسم أو الحالة..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pr-4 pl-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase">
                                <tr>
                                    <th className="p-4 text-right">اسم المريض</th>
                                    <th className="p-4 text-right">الحالة الأولية</th>
                                    <th className="p-4 text-right">المسعف المسؤول</th>
                                    <th className="p-4 text-right">تاريخ الاستقبال</th>
                                    <th className="p-4 text-center">الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => (
                                        <tr key={patient._id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-blue-500"/>
                                                </div>
                                                <span>{patient.firstName} {patient.lastName}</span>
                                            </td>
                                            <td className="p-4 text-gray-700">{patient.currentCondition}</td>
                                            <td className="p-4 text-gray-700 flex items-center gap-2">
                                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                                {patient.createdBy?.fullName || 'غير معروف'}
                                            </td>
                                            <td className="p-4 text-gray-500 flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {new Date(patient.createdAt).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`px-3 py-1 font-semibold rounded-full ${getStatusChip(patient.status)}`}>
                                                    {patient.status === 'pending' ? 'قيد الانتظار' : patient.status === 'confirmed' ? 'مؤكد' : 'تم العلاج'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-16 text-gray-500">
                                            <ServerCrash className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                                            <p className="text-lg">لا توجد سجلات لعرضها.</p>
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
