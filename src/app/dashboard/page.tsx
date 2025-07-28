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

interface StaffMember {
    _id: string;
    name: string;
}

interface Department {
    _id: string;
    isAvailable: boolean;
    staff: StaffMember[];
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
    const { user, logout, isLoading: authLoading } = useAuth();
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