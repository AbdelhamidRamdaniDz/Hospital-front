'use client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import API from '@/lib/axios';
import axios from 'axios';

import { 
    ShieldCheck,
    Hospital,
    Ambulance,
    LogOut,
    AlertCircle,
    UserPlus,
    Building,
    Users,
    Trash2,
    Edit,
    Loader2,
    Search,
    CheckCircle,
    TrendingUp,
    X,
    AlertTriangle,
    Info
} from 'lucide-react';

interface Hospital {
    _id: string;
    name: string;
    email: string;
    formattedAddress: string;
}

interface Paramedic {
    _id: string;
    fullName: string;
    email: string;
    nationalId: string;
    associatedAmbulance: string;
}

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    isVisible: boolean;
}

export default function AdminDashboardPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [paramedics, setParamedics] = useState<Paramedic[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
        const newNotification: Notification = {
            id: Date.now().toString(),
            type,
            title,
            message,
            timestamp: new Date(),
            isVisible: true
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        setTimeout(() => {
            removeNotification(newNotification.id);
        }, 5000);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const res = await API.get('/admin/users');
            setHospitals(res.data.data.hospitals || []);
            setParamedics(res.data.data.paramedics || []);
            addNotification('success', 'تم التحميل بنجاح', 'تم تحميل بيانات المستخدمين بنجاح');
        } catch (error) {
            console.error("Failed to fetch users", error);
            addNotification('error', 'خطأ في التحميل', 'فشل في تحميل بيانات المستخدمين. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (user?.role !== 'super-admin') {
                router.push('/login');
            } else {
                fetchData();
            }
        }
    }, [user, authLoading, router]);
    
    const handleEditUser = (id: string, role: 'hospital' | 'paramedic') => {
        addNotification('info', 'ميزة قيد التطوير', `سيتم توجيهك لصفحة تعديل ${role === 'hospital' ? 'المستشفى' : 'المسعف'} قريباً.`);
    };

    const handleDeleteUser = async (id: string, role: 'hospital' | 'paramedic') => {
        if (!window.confirm(`هل أنت متأكد من رغبتك في حذف هذا الحساب؟`)) return;
        
        try {
            await API.delete(`/admin/users/${id}`, { data: { role } });
            addNotification('success', 'تم الحذف بنجاح', `تم حذف ${role === 'hospital' ? 'المستشفى' : 'المسعف'} من النظام بنجاح.`);
            
            if (role === 'hospital') {
                setHospitals(prev => prev.filter(h => h._id !== id));
            } else {
                setParamedics(prev => prev.filter(p => p._id !== id));
            }
        } catch (err) {
            const errorMsg = axios.isAxiosError(err) && err.response 
                ? err.response.data.message 
                : 'حدث خطأ أثناء الحذف.';
            addNotification('error', 'فشل في الحذف', errorMsg);
        }
    };

    const filteredHospitals = hospitals.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredParamedics = paramedics.filter(p => p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || p.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const isLoading = authLoading || loadingData;

    if (isLoading) {
        return (
             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin absolute top-4 right-4" />
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }
    
    if (!user) {
         return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50" dir="rtl">
                <div className="text-center bg-white p-10 rounded-2xl shadow-2xl border border-red-100 max-w-md mx-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">وصول مرفوض</h3>
                    <p className="text-gray-600 mb-6">يرجى تسجيل الدخول أولاً للوصول إلى لوحة التحكم.</p>
                    <button 
                        onClick={() => router.push('/login')} 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
                    >
                        الذهاب لصفحة الدخول
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />
            
            <div className="container mx-auto p-6 max-w-7xl">
                <header className="mb-12">
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25"></div>
                                    <div className="relative p-4 bg-white rounded-2xl shadow-lg">
                                        <ShieldCheck className="w-10 h-10 text-blue-600" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                                        لوحة تحكم المسؤول
                                    </h1>
                                    <p className="text-gray-600 text-lg">إدارة شاملة للمستخدمين والنظام</p>
                                </div>
                            </div>
                            <button 
                                onClick={logout}
                                className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-6 py-3 rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                <LogOut className="w-5 h-5"/>
                                <span>تسجيل الخروج</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="space-y-12">
                    <section>
                         <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                            <UserPlus className="w-8 h-8 text-blue-600" />
                            إجراءات سريعة
                        </h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ActionCard 
                                href="/admin/create-user?role=hospital"
                                icon={<Hospital className="w-16 h-16"/>}
                                title="إنشاء حساب مستشفى"
                                description="إضافة مستشفى جديد إلى النظام مع تحديد موقعه وبياناته الكاملة."
                                color="blue"
                            />
                            <ActionCard 
                                href="/admin/create-user?role=paramedic"
                                icon={<Ambulance className="w-16 h-16"/>}
                                title="إنشاء حساب مسعف"
                                description="إضافة مسعف جديد وتعيينه لسيارة إسعاف محددة مع تحديد صلاحياته."
                                color="green"
                            />
                        </div>
                    </section>
                    
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-2xl">
                                    <Building className="w-7 h-7 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800">قائمة المستشفيات</h2>
                                    <p className="text-gray-600">إجمالي {filteredHospitals.length} مستشفى مسجل</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                            <HospitalsTable hospitals={filteredHospitals} onEdit={handleEditUser} onDelete={handleDeleteUser} />
                        </div>
                    </section>
                    
                    <section>
                         <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-2xl">
                                    <Users className="w-7 h-7 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800">قائمة المسعفين</h2>
                                    <p className="text-gray-600">إجمالي {filteredParamedics.length} مسعف مسجل</p>
                                </div>
                            </div>
                        </div>
                         <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                           <ParamedicsTable paramedics={filteredParamedics} onEdit={handleEditUser} onDelete={handleDeleteUser} />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

function NotificationContainer({ notifications, onRemove }: { notifications: Notification[], onRemove: (id: string) => void }) {
    return (
        <div className="fixed top-6 left-6 z-50 space-y-4 max-w-md">
            {notifications.map((notification) => (
                <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                    onRemove={onRemove} 
                />
            ))}
        </div>
    );
}

function NotificationCard({ notification, onRemove }: { notification: Notification, onRemove: (id: string) => void }) {
    const [isLeaving, setIsLeaving] = useState(false);
    
    const handleRemove = () => {
        setIsLeaving(true);
        setTimeout(() => onRemove(notification.id), 300);
    };

    const getNotificationStyles = (type: string) => {
        const styles = {
            success: {
                bg: 'from-emerald-50 via-green-50 to-emerald-50',
                border: 'border-emerald-200',
                icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
                iconBg: 'bg-emerald-100',
                accent: 'bg-emerald-500',
                shadow: 'shadow-emerald-200/50'
            },
            error: {
                bg: 'from-red-50 via-rose-50 to-red-50',
                border: 'border-red-200',
                icon: <AlertCircle className="w-6 h-6 text-red-600" />,
                iconBg: 'bg-red-100',
                accent: 'bg-red-500',
                shadow: 'shadow-red-200/50'
            },
            warning: {
                bg: 'from-amber-50 via-yellow-50 to-amber-50',
                border: 'border-amber-200',
                icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
                iconBg: 'bg-amber-100',
                accent: 'bg-amber-500',
                shadow: 'shadow-amber-200/50'
            },
            info: {
                bg: 'from-blue-50 via-cyan-50 to-blue-50',
                border: 'border-blue-200',
                icon: <Info className="w-6 h-6 text-blue-600" />,
                iconBg: 'bg-blue-100',
                accent: 'bg-blue-500',
                shadow: 'shadow-blue-200/50'
            }
        };
        return styles[type as keyof typeof styles];
    };

    const styles = getNotificationStyles(notification.type);

    return (
        <div 
            className={`
                relative overflow-hidden bg-gradient-to-r ${styles.bg} ${styles.border} ${styles.shadow}
                backdrop-blur-lg border-2 rounded-2xl shadow-xl 
                transform transition-all duration-500 ease-out
                ${isLeaving ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}
                animate-in slide-in-from-left-5 duration-500
                hover:shadow-2xl hover:scale-105
                min-w-96 max-w-md
            `}
        >
            <div className={`absolute top-0 left-0 right-0 h-1 ${styles.accent}`}></div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 animate-pulse"></div>
            
            <div className="relative p-5">
                <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 p-2 ${styles.iconBg} rounded-xl shadow-md transform transition-transform duration-300 hover:scale-110`}>
                        {styles.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-bold text-gray-800 truncate">
                                {notification.title}
                            </h4>
                            <button 
                                onClick={handleRemove}
                                className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full transition-all duration-200 hover:scale-110"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            {notification.message}
                        </p>
                        
                        <div className="text-xs text-gray-400 font-medium">
                            {notification.timestamp.toLocaleTimeString('ar-EG', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: true 
                            })}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/30">
                <div 
                    className={`h-full ${styles.accent} transition-all duration-5000 ease-linear`}
                    style={{ 
                        width: '100%',
                        animation: 'progress 5s linear forwards'
                    }}
                ></div>
            </div>
        </div>
    );
}

function ActionCard({ href, icon, title, description, color }: { href: string; icon: React.ReactNode; title: string; description: string; color: string; }) {
    const colors: Record<string, string> = {
        blue: 'from-blue-50 via-blue-100 to-blue-200 text-blue-700 hover:border-blue-400 shadow-blue-200/50',
        green: 'from-green-50 via-green-100 to-green-200 text-green-700 hover:border-green-400 shadow-green-200/50'
    };
    return (
        <Link href={href} className="block relative overflow-hidden">
            <div className={`p-10 bg-gradient-to-br ${colors[color]} rounded-3xl shadow-xl border-2 border-transparent transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 ${colors[color].split(' ')[4]}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
                <div className="relative flex flex-col items-center text-center">
                    <div className="mb-6 transform transition-transform duration-300 hover:scale-110">{icon}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
            </div>
        </Link>
    );
}

function SearchBar({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (term: string) => void; }) {
    return (
        <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
                type="text"
                placeholder="بحث شامل في المستخدمين..."
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-black text-right shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
}

function HospitalsTable({ hospitals, onEdit, onDelete }: { hospitals: Hospital[], onEdit: Function, onDelete: Function }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                        <th className="p-6 text-right font-bold text-gray-700 text-lg">اسم المستشفى</th>
                        <th className="p-6 text-right font-bold text-gray-700 text-lg">البريد الإلكتروني</th>
                        <th className="p-6 text-right font-bold text-gray-700 text-lg">العنوان</th>
                        <th className="p-6 text-center font-bold text-gray-700 text-lg">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {hospitals.map((hospital, index) => (
                        <tr key={hospital._id} className={`border-t hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'}`}>
                            <td className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><Hospital className="w-5 h-5 text-blue-600" /></div>
                                    <span className="font-semibold text-gray-900 text-lg">{hospital.name}</span>
                                </div>
                            </td>
                            <td className="p-6 text-gray-600 text-lg">{hospital.email}</td>
                            <td className="p-6 text-gray-600 text-lg">{hospital.formattedAddress || 'غير محدد'}</td>
                            <td className="p-6"><div className="flex justify-center gap-2"><button onClick={() => onEdit(hospital._id, 'hospital')} className="p-3 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200 hover:scale-110"><Edit size={18}/></button><button onClick={() => onDelete(hospital._id, 'hospital')} className="p-3 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200 hover:scale-110"><Trash2 size={18}/></button></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ParamedicsTable({ paramedics, onEdit, onDelete }: { paramedics: Paramedic[], onEdit: Function, onDelete: Function }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                        <th className="p-6 text-right font-bold text-gray-700 text-lg">الاسم الكامل</th>
                        <th className="p-6 text-right font-bold text-gray-700 text-lg">البريد الإلكتروني</th>
                        <th className="p-6 text-right font-bold text-gray-700 text-lg">سيارة الإسعاف</th>
                        <th className="p-6 text-center font-bold text-gray-700 text-lg">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {paramedics.map((paramedic, index) => (
                         <tr key={paramedic._id} className={`border-t hover:bg-green-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'}`}>
                            <td className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><Ambulance className="w-5 h-5 text-green-600" /></div>
                                    <span className="font-semibold text-gray-900 text-lg">{paramedic.fullName}</span>
                                </div>
                            </td>
                            <td className="p-6 text-gray-600 text-lg">{paramedic.email}</td>
                            <td className="p-6 text-gray-600 text-lg">{paramedic.associatedAmbulance || 'غير محدد'}</td>
                            <td className="p-6"><div className="flex justify-center gap-2"><button onClick={() => onEdit(paramedic._id, 'paramedic')} className="p-3 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200 hover:scale-110"><Edit size={18}/></button><button onClick={() => onDelete(paramedic._id, 'paramedic')} className="p-3 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200 hover:scale-110"><Trash2 size={18}/></button></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function StatsCard({ icon, title, value, color, trend }: { icon: React.ReactNode; title: string; value: number | string; color: string; trend: string; }) {
    const colors: Record<string, string> = {
        blue: 'from-blue-500 to-indigo-600 bg-blue-50 text-blue-600',
        green: 'from-green-500 to-emerald-600 bg-green-50 text-green-600',
        purple: 'from-purple-500 to-violet-600 bg-purple-50 text-purple-600'
    };
    return (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${colors[color].split(' ')[2]} ${colors[color].split(' ')[3]} rounded-2xl`}>{icon}</div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold"><TrendingUp className="w-4 h-4" />{trend}</div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    );
}

const styles = `
@keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}