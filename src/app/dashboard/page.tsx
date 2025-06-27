'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import API from '@/lib/axios';

// Import Components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsSection from '@/components/dashboard/StatsSection';
import QuickActions from '@/components/dashboard/QuickActions';
import LoadingScreen from '@/components/dashboard/LoadingScreen';
import AuthRequired from '@/components/dashboard/AuthRequired';

interface Department {
    _id: string;
    isAvailable: boolean;
    staff: any[];
    activeStaffCount: number;
}

interface PatientNotification {
    _id: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    status: string;
}

export default function DashboardPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [notifications, setNotifications] = useState<PatientNotification[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const totalStaff = departments.reduce((acc, d) => acc + (d.activeStaffCount || 0), 0);
    const availableDepartments = departments.filter(d => d.isAvailable).length;

    const fetchData = useCallback(async () => {
        try {
            const [deptsRes, notificationsRes] = await Promise.all([
                API.get('/hospitals/departments'),
                API.get('/hospitals/patient-log')
            ]);
            setDepartments(deptsRes.data.data || []);
            
            const pendingPatients = (notificationsRes.data.data || []).filter((p: PatientNotification) => p.status === 'pending');
            setNotifications(pendingPatients);

        } catch (err) {
            console.error('فشل في جلب البيانات', err);
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchData(); // جلب البيانات عند التحميل
            const intervalId = setInterval(fetchData, 30000); // تحديث كل 30 ثانية
            return () => clearInterval(intervalId);
        } else {
            setLoadingData(false);
        }
    }, [user, fetchData]);
    
    const isLoading = authLoading || loadingData;

    if (isLoading) {
        return <LoadingScreen />;
    }
    
    if (!user) {
        return <AuthRequired />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
            <DashboardHeader 
                user={user}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                logout={logout}
                notifications={notifications}
            />

            <main className="p-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <WelcomeBanner userName={user.displayName} />
                </div>

                <StatsSection 
                    totalStaff={totalStaff}
                    availableDepartments={availableDepartments}
                    totalDepartments={departments.length}
                />
                
                <QuickActions />
            </main>
        </div>
    );
}


// 'use client';
// import { useEffect, useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import API from '@/lib/axios';
// import Link from 'next/link';

// import { 
//     Activity, 
//     Users, 
//     Building2, 
//     TrendingUp, 
//     AlertCircle,
//     LogOut,
//     Stethoscope,
//     LayoutList,
//     UserPlus,
//     CalendarClock,
//     ClipboardList,
//     Settings,
//     Bell,
//     Menu,
//     X,
//     ChevronRight,
//     Hospital,
//     Shield,
//     Clock
// } from 'lucide-react';

// interface Department {
//     _id: string;
//     isAvailable: boolean;
//     staff: any[];
//     activeStaffCount: number;
// }

// export default function DashboardPage() {
//     const { user, logout } = useAuth();
//     const [departments, setDepartments] = useState<Department[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     const totalStaff = departments.reduce((acc, d) => acc + d.activeStaffCount, 0);
//     const availableDepartments = departments.filter(d => d.isAvailable).length;

//     useEffect(() => {
//         const fetchDepartments = async () => {
//             try {
//                 const res = await API.get('/hospitals/departments');
//                 setDepartments(res.data.data || []);
//             } catch (err) {
//                 console.error('فشل في جلب الأقسام', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (user) {
//             fetchDepartments();
//         } else {
//             setLoading(false);
//         }
//     }, [user]);
    
//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
//                 <div className="text-center bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
//                     <div className="relative w-20 h-20 mx-auto mb-6">
//                         <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
//                         <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
//                         <Hospital className="absolute inset-0 m-auto w-8 h-8 text-blue-600" />
//                     </div>
//                     <h3 className="text-xl font-bold text-black mb-2">جاري تحميل لوحة التحكم</h3>
//                     <p className="text-gray-600">يرجى الانتظار...</p>
//                 </div>
//             </div>
//         );
//     }
    
//     if (!user) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
//                 <div className="text-center bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-md">
//                     <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
//                         <AlertCircle className="w-10 h-10 text-red-500" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-black mb-3">تسجيل الدخول مطلوب</h3>
//                     <p className="text-gray-600 mb-6">يرجى تسجيل الدخول للوصول إلى لوحة التحكم</p>
//                     <Link href="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
//                         <Shield className="w-5 h-5" />
//                         الذهاب لصفحة الدخول
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
//             <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
//                 <div className="max-w-7xl mx-auto px-6 py-4">
//                     <div className="flex justify-between items-center">
//                         <div className="flex items-center gap-4">
//                             <button
//                                 onClick={() => setSidebarOpen(!sidebarOpen)}
//                                 className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                             >
//                                 {sidebarOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
//                             </button>
                            
//                             <div className="flex items-center gap-3">
//                                 <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//                                     <Hospital className="w-6 h-6 text-white" />
//                                 </div>
//                                 <div>
//                                     <h1 className="text-2xl font-bold text-black">مستشفى {user.displayName}</h1>
//                                     <p className="text-gray-600 text-sm">لوحة التحكم الرئيسية</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-3">
//                             <button className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors">
//                                 <Bell className="w-5 h-5 text-black" />
//                                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//                             </button>
                            
//                             <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors">
//                                 <Settings className="w-5 h-5 text-black" />
//                             </button>
                            
//                             <div className="w-px h-8 bg-gray-200"></div>
                            
//                             <button 
//                                 onClick={logout} 
//                                 className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
//                                 title="تسجيل الخروج"
//                             >
//                                 <LogOut className="w-4 h-4" />
//                                 <span className="hidden sm:block">خروج</span>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <main className="p-6 max-w-7xl mx-auto">
//                 <div className="mb-8">
//                     <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
//                         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
//                         <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                        
//                         <div className="relative z-10">
//                             <div className="flex items-center gap-3 mb-4">
//                                 <Clock className="w-6 h-6" />
//                                 <span className="text-blue-100">
//                                     {new Date().toLocaleDateString('ar-EG', { 
//                                         weekday: 'long', 
//                                         year: 'numeric', 
//                                         month: 'long', 
//                                         day: 'numeric' 
//                                     })}
//                                 </span>
//                             </div>
//                             <h2 className="text-3xl font-bold mb-2">مرحباً بعودتك!</h2>
//                             <p className="text-blue-100 text-lg">إليك نظرة عامة على أداء المستشفى اليوم</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     <StatCard 
//                         icon={<Users className="w-8 h-8" />}
//                         label="الطاقم النشط" 
//                         value={totalStaff} 
//                         color="blue"
//                         trend="+5%"
//                     />
//                     <StatCard 
//                         icon={<Building2 className="w-8 h-8" />}
//                         label="الأقسام المتاحة" 
//                         value={`${availableDepartments} / ${departments.length}`}
//                         color="green"
//                         trend="100%"
//                     />
//                     <StatCard 
//                         icon={<Activity className="w-8 h-8" />}
//                         label="حالة النظام" 
//                         value="نشط" 
//                         color="teal"
//                         trend="متصل"
//                     />
//                 </div>
                
//                 <div className="mb-8">
//                     <div className="flex items-center justify-between mb-6">
//                         <h2 className="text-2xl font-bold text-black">الإجراءات السريعة</h2>
//                         <ChevronRight className="w-5 h-5 text-gray-400" />
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         <DashboardCard
//                             href="/departments"
//                             icon={<LayoutList className="w-10 h-10" />}
//                             title="إدارة الأقسام"
//                             description="عرض تفاصيل الأقسام والطاقم المناوب وإدارة الموظفين"
//                             color="blue"
//                         />
//                         <DashboardCard
//                             href="/doctors"
//                             icon={<Stethoscope className="w-10 h-10" />}
//                             title="إدارة الأطباء"
//                             description="إنشاء حسابات جديدة للأطباء وتعديل بياناتهم"
//                             color="green"
//                         />
//                         <DashboardCard
//                             href="/add-staff"
//                             icon={<UserPlus className="w-10 h-10" />}
//                             title="إضافة طاقم طبي"
//                             description="توزيع الأطباء على الأقسام وتحديد أدوارهم"
//                             color="indigo"
//                         />
//                         <DashboardCard
//                             href="/schedule"
//                             icon={<CalendarClock className="w-10 h-10" />}
//                             title="جدول المناوبات"
//                             description="عرض جداول الطواقم الطبية في جميع الأقسام"
//                             color="purple"
//                         />
//                         <DashboardCard
//                             href="/patient-log"
//                             icon={<ClipboardList className="w-10 h-10" />}
//                             title="سجل المرضى"
//                             description="عرض سجل الحالات الطارئة المستقبلة"
//                             color="red"
//                         />
//                         <DashboardCard
//                             href="/status"
//                             icon={<TrendingUp className="w-10 h-10" />}
//                             title="تحديث الحالة"
//                             description="تعديل جاهزية الطوارئ والأسرة المتاحة"
//                             color="orange"
//                         />
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

// function StatCard({ icon, label, value, color, trend }: { 
//     icon: React.ReactNode; 
//     label: string; 
//     value: number | string; 
//     color: string;
//     trend?: string;
// }) {
//     const colors: Record<string, { bg: string; text: string; accent: string }> = {
//         blue: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', accent: 'bg-blue-50' },
//         green: { bg: 'from-green-500 to-green-600', text: 'text-green-600', accent: 'bg-green-50' },
//         teal: { bg: 'from-teal-500 to-teal-600', text: 'text-teal-600', accent: 'bg-teal-50' },
//     };

//     return (
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center justify-between mb-4">
//                 <div className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${colors[color].bg} text-white shadow-lg`}>
//                     {icon}
//                 </div>
//                 {trend && (
//                     <div className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[color].accent} ${colors[color].text}`}>
//                         {trend}
//                     </div>
//                 )}
//             </div>
//             <div className="text-3xl font-bold text-black mb-1">{value}</div>
//             <div className="text-gray-600">{label}</div>
//         </div>
//     );
// }

// function DashboardCard({ href, icon, title, description, color }: { 
//     href: string; 
//     icon: React.ReactNode; 
//     title: string; 
//     description: string; 
//     color: string; 
// }) {
//     const colors: Record<string, { border: string; icon: string; bg: string }> = {
//         blue: { border: 'hover:border-blue-500', icon: 'text-blue-500', bg: 'bg-blue-50' },
//         green: { border: 'hover:border-green-500', icon: 'text-green-500', bg: 'bg-green-50' },
//         indigo: { border: 'hover:border-indigo-500', icon: 'text-indigo-500', bg: 'bg-indigo-50' },
//         purple: { border: 'hover:border-purple-500', icon: 'text-purple-500', bg: 'bg-purple-50' },
//         red: { border: 'hover:border-red-500', icon: 'text-red-500', bg: 'bg-red-50' },
//         orange: { border: 'hover:border-orange-500', icon: 'text-orange-500', bg: 'bg-orange-50' },
//     };

//     return (
//         <Link href={href} className="group block">
//             <div className={`bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 ${colors[color].border} transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group-hover:scale-[1.02]`}>
//                 <div className={`mb-4 inline-flex p-4 ${colors[color].bg} rounded-2xl ${colors[color].icon} group-hover:scale-110 transition-transform duration-300`}>
//                     {icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-black mb-3 group-hover:text-gray-900 transition-colors">{title}</h3>
//                 <p className="text-gray-600 text-sm leading-relaxed mb-3">{description}</p>
//                 <div className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
//                     <span>عرض التفاصيل</span>
//                     <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                 </div>
//             </div>
//         </Link>
//     );
// }