'use client';
import React, { useEffect, useState } from 'react';import { useAuth } from '@/hooks/useAuth';
import API from '@/lib/axios';
import Link from 'next/link';

import { 
    CalendarClock,
    ArrowLeft,
    Users,
    Building2,
    PieChart,
    Loader2,
    Eye,
    Edit3,
    UserCheck,
    Stethoscope,
    Heart,
    Brain,
    Bone,
    Baby,
    Zap,
    Building,
    LucideIcon
} from 'lucide-react';
interface Doctor {
    fullName: string;
}

interface StaffMember {
    doctor: Doctor;
    roleInDepartment: string;
    onDuty: boolean;
}

interface Department {
    _id: string;
    name: string;
    icon: string;
    color: string;
    isAvailable: boolean;
    staff: StaffMember[];
    activeStaffCount: number;
}

const getIconComponent = (iconName: string): LucideIcon => {
     const icons: Record<string, LucideIcon> = {
      zap: Zap,
      heart: Heart,
      baby: Baby,
      bone: Bone,
      eye: Eye,
      brain: Brain,
      stethoscope: Stethoscope,
      building: Building
    };
    return icons[iconName] || Building;
};

export default function SchedulePage() {
    const { user } = useAuth();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    const totalActiveStaff = departments.reduce((acc, dept) => acc + (dept.activeStaffCount || 0), 0);
    const totalStaffCount = departments.reduce((acc, dept) => acc + (dept.staff?.length || 0), 0);
    const availabilityPercentage = totalStaffCount > 0 ? Math.round((totalActiveStaff / totalStaffCount) * 100) : 0;

    useEffect(() => {
        const fetchDepartments = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const res = await API.get('/hospitals/departments');
                setDepartments(res.data.data || []);
            } catch (err) {
                console.error('فشل في جلب الأقسام', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                    <p className="text-lg font-medium text-gray-700">جاري تحميل جدول المناوبات...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-md border">
                               <CalendarClock className="w-10 h-10 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">جدول المناوبات</h1>
                                <p className="text-gray-500 text-lg">نظرة عامة على حالة الأقسام والطواقم الطبية</p>
                            </div>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-lg border shadow-sm hover:shadow-md">
                            <ArrowLeft className="w-5 h-5" />
                            <span>العودة</span>
                        </Link>
                    </div>
                </header>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard icon={<Users />} label="إجمالي الطاقم النشط" value={totalActiveStaff} color="blue" />
                    <StatCard icon={<Building2 />} label="إجمالي الأقسام" value={departments.length} color="green" />
                    <StatCard icon={<PieChart />} label="نسبة التوفر العامة" value={`${availabilityPercentage}%`} color="orange" />
                </section>
                <main className="space-y-6">
                    {departments.map(dept => {
                        const IconComponent = getIconComponent(dept.icon);
                        const availability = dept.staff.length > 0 ? Math.round((dept.activeStaffCount / dept.staff.length) * 100) : 0;
                        const onDutyStaff = dept.staff.filter(s => s.onDuty);

                        return (
                            <div key={dept._id} className="bg-white rounded-2xl shadow-xl border overflow-hidden" style={{ borderColor: dept.color }}>
                                <div className="p-6 flex justify-between items-center border-b" style={{ borderBottomColor: `${dept.color}20`}}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 flex items-center justify-center rounded-xl text-white shadow-lg" style={{ backgroundColor: dept.color }}>
                                            <IconComponent className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">{dept.name}</h2>
                                            <p className="text-sm text-gray-500">{dept.isAvailable ? 'القسم متاح' : 'القسم مغلق'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg">{availability}%</div>
                                        <div className="text-sm text-gray-500">توفر الطاقم</div>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 h-2">
                                    <div className="h-2 rounded-l-full" style={{ width: `${availability}%`, backgroundColor: dept.color }}></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><UserCheck className="w-5 h-5 text-gray-400" />الطاقم المناوب حالياً ({onDutyStaff.length})</h3>
                                    {onDutyStaff.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {onDutyStaff.map((member, index) => (
                                                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                        {member.doctor?.fullName?.charAt(0) || 'D'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{member.doctor?.fullName}</p>
                                                        <p className="text-sm text-gray-500">{member.roleInDepartment}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">لا يوجد طاقم مناوب حاليًا.</p>
                                    )}
                                </div>
                                <div className="bg-gray-50/70 p-4 border-t flex justify-end gap-3">
                                    <Link href={`/departments/${dept._id}`} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                        <Eye className="w-4 h-4"/>
                                        <span>عرض التفاصيل</span>
                                    </Link>
                                    <Link href={`/departments/${dept._id}/edit`} className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg font-medium border hover:bg-gray-100 transition-colors shadow-sm">
                                        <Edit3 className="w-4 h-4"/>
                                        <span>تعديل</span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </main>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string; }) {
    const colors: Record<string, { bg: string; text: string; }> = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
        green: { bg: 'bg-green-100', text: 'text-green-600' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    };
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-5 border border-gray-100">
            <div className={`w-16 h-16 flex items-center justify-center rounded-xl ${colors[color].bg} ${colors[color].text}`}>
                {icon}
            </div>
            <div>
                <div className="text-3xl font-bold text-gray-800">{value}</div>
                <div className="text-gray-500">{label}</div>
            </div>
        </div>
    );
}
