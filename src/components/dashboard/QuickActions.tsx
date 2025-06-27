'use client';
import { 
    ChevronRight,
    Stethoscope,
    LayoutList,
    UserPlus,
    CalendarClock,
    ClipboardList,
    TrendingUp
} from 'lucide-react';
import DashboardCard from './DashboardCard';

export default function QuickActions() {
    const quickActionItems = [
        {
            href: "/departments",
            icon: <LayoutList className="w-10 h-10" />,
            title: "إدارة الأقسام",
            description: "عرض تفاصيل الأقسام والطاقم المناوب وإدارة الموظفين",
            color: "blue"
        },
        {
            href: "/doctors",
            icon: <Stethoscope className="w-10 h-10" />,
            title: "إدارة الأطباء",
            description: "إنشاء حسابات جديدة للأطباء وتعديل بياناتهم",
            color: "green"
        },
        {
            href: "/add-staff",
            icon: <UserPlus className="w-10 h-10" />,
            title: "إضافة طاقم طبي",
            description: "توزيع الأطباء على الأقسام وتحديد أدوارهم",
            color: "indigo"
        },
        {
            href: "/schedule",
            icon: <CalendarClock className="w-10 h-10" />,
            title: "جدول المناوبات",
            description: "عرض جداول الطواقم الطبية في جميع الأقسام",
            color: "purple"
        },
        {
            href: "/patient-log",
            icon: <ClipboardList className="w-10 h-10" />,
            title: "سجل المرضى",
            description: "عرض سجل الحالات الطارئة المستقبلة",
            color: "red"
        },
        {
            href: "/status",
            icon: <TrendingUp className="w-10 h-10" />,
            title: "تحديث الحالة",
            description: "تعديل جاهزية الطوارئ والأسرة المتاحة",
            color: "orange"
        }
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">الإجراءات السريعة</h2>
                <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickActionItems.map((item, index) => (
                    <DashboardCard
                        key={index}
                        href={item.href}
                        icon={item.icon}
                        title={item.title}
                        description={item.description}
                        color={item.color}
                    />
                ))}
            </div>
        </div>
    );
}