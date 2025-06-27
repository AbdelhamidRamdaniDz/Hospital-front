'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, Settings, LogOut, Menu, X, Hospital } from 'lucide-react';

interface PatientNotification {
    _id: string;
    firstName: string;
    lastName: string;
    createdAt: string;
}

interface DashboardHeaderProps {
    user: any;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    logout: () => void;
    notifications: PatientNotification[];
}

export default function DashboardHeader({ 
    user, 
    sidebarOpen, 
    setSidebarOpen, 
    logout,
    notifications
}: DashboardHeaderProps) {

    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(notifications.length > 0) {
            setHasUnread(true);
        }
    }, [notifications]);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notificationRef]);

    return (
        <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {sidebarOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Hospital className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-black">مستشفى {user.displayName}</h1>
                                <p className="text-gray-600 text-sm">لوحة التحكم الرئيسية</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                         <div ref={notificationRef} className="relative">
                           <button onClick={() => {setNotificationOpen(o => !o); setHasUnread(false);}} className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors">
                                <Bell className="w-5 h-5 text-black" />
                                {hasUnread && <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />}
                           </button>
                           {isNotificationOpen && <NotificationDropdown notifications={notifications} onClose={() => setNotificationOpen(false)} />}
                        </div>
                        
                        <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors">
                            <Settings className="w-5 h-5 text-black" />
                        </button>
                        
                        <div className="w-px h-8 bg-gray-200"></div>
                        
                        <button 
                            onClick={logout} 
                            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                            title="تسجيل الخروج"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:block">خروج</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}


function NotificationDropdown({ notifications, onClose }: { notifications: PatientNotification[], onClose: () => void }) {
    return (
        <div className="absolute top-14 left-0 w-80 bg-white rounded-2xl shadow-2xl border z-50 animate-in fade-in-0 slide-in-from-top-5">
            <div className="p-4 border-b flex justify-between items-center"><h3 className="font-bold text-gray-800">الإشعارات ({notifications.length})</h3><button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X className="w-4 h-4"/></button></div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notif => (<Link key={notif._id} href="/patient-log" onClick={onClose} className="block p-4 hover:bg-gray-50 border-b"><p className="font-semibold text-gray-800">حالة جديدة: {notif.firstName} {notif.lastName}</p><p className="text-xs text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}</p></Link>))
                ) : (<p className="p-8 text-center text-gray-500">لا توجد إشعارات جديدة.</p>)}
            </div>
             <div className="p-2 bg-gray-50 rounded-b-2xl text-center"><Link href="/patient-log" onClick={onClose} className="text-sm font-medium text-blue-600 hover:underline">عرض كل السجلات</Link></div>
        </div>
    );
}
