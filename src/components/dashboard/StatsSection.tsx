'use client';
import { Users, Building2, Activity } from 'lucide-react';
import StatCard from './StatCard';

interface StatsSectionProps {
    totalStaff: number;
    availableDepartments: number;
    totalDepartments: number;
}

export default function StatsSection({ 
    totalStaff, 
    availableDepartments, 
    totalDepartments 
}: StatsSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
                icon={<Users className="w-8 h-8" />}
                label="الطاقم النشط" 
                value={totalStaff} 
                color="blue"
                trend="+5%"
            />
            <StatCard 
                icon={<Building2 className="w-8 h-8" />}
                label="الأقسام المتاحة" 
                value={`${availableDepartments} / ${totalDepartments}`}
                color="green"
                trend="100%"
            />
            <StatCard 
                icon={<Activity className="w-8 h-8" />}
                label="حالة النظام" 
                value="نشط" 
                color="teal"
                trend="متصل"
            />
        </div>
    );
}