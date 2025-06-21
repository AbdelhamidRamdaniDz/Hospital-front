'use client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// استيراد الأيقونات
import { 
    ShieldCheck,
    Hospital,
    Ambulance,
    LogOut,
    AlertCircle
} from 'lucide-react';

// المكون الرئيسي للصفحة
export default function AdminDashboardPage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // إذا انتهى التحميل والمستخدم ليس مسؤولاً، أعد توجيهه
        if (!loading && user?.role !== 'super-admin') {
            router.push('/login');
        }
    }, [user, loading, router]);

    // عرض حالة التحميل
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>جاري التحقق من الصلاحيات...</p>
            </div>
        );
    }
    
    // التحقق من صلاحيات المسؤول
    if (user?.role !== 'super-admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
                <div className="text-center bg-white p-8 rounded-xl shadow-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">وصول مرفوض</h3>
                    <p className="text-gray-600">ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة.</p>
                    <button onClick={() => router.push('/login')} className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        الذهاب لصفحة الدخول
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100" dir="rtl">
            <div className="container mx-auto p-6 max-w-4xl">
                
                {/* رأس الصفحة */}
                <header className="mb-10">
                    <div className="flex justify-between items-center">
                         <div className="flex items-center gap-4">
                             <div className="p-3 bg-white rounded-xl shadow-md border">
                                <ShieldCheck className="w-8 h-8 text-blue-600" />
                             </div>
                             <div>
                                <h1 className="text-4xl font-bold text-gray-800">لوحة تحكم المسؤول</h1>
                                <p className="text-gray-500 text-lg">إدارة المستخدمين والنظام.</p>
                             </div>
                         </div>
                         <button 
                            onClick={logout}
                            className="flex items-center gap-2 bg-white text-red-600 font-semibold px-4 py-2 rounded-lg border shadow-sm hover:bg-red-50 transition-colors"
                         >
                            <LogOut className="w-5 h-5"/>
                            <span>تسجيل الخروج</span>
                         </button>
                    </div>
                </header>

                {/* بطاقات الإجراءات */}
                <main>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ActionCard 
                            href="/admin/create-user?role=hospital"
                            icon={<Hospital className="w-12 h-12"/>}
                            title="إنشاء حساب مستشفى"
                            description="إضافة مستشفى جديد إلى النظام مع تحديد موقعه."
                            color="blue"
                        />
                         <ActionCard 
                            href="/admin/create-user?role=paramedic"
                            icon={<Ambulance className="w-12 h-12"/>}
                            title="إنشاء حساب مسعف"
                            description="إضافة مسعف جديد وتعيينه لسيارة إسعاف محددة."
                            color="green"
                        />
                    </div>
                </main>

            </div>
        </div>
    );
}

// مكون بطاقة الإجراء
function ActionCard({ href, icon, title, description, color }: { href: string; icon: React.ReactNode; title: string; description: string; color: string; }) {
    const colors: Record<string, string> = {
        blue: 'from-blue-50 to-blue-100 text-blue-700 hover:border-blue-500',
        green: 'from-green-50 to-green-100 text-green-700 hover:border-green-500'
    };

    return (
        <Link href={href} className={`block p-8 bg-gradient-to-br ${colors[color]} rounded-2xl shadow-lg border-2 border-transparent transition-all duration-300 hover:shadow-2xl hover:scale-105`}>
            <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </Link>
    );
}
