'use client';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface DashboardCardProps {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}

export default function DashboardCard({ 
    href, 
    icon, 
    title, 
    description, 
    color 
}: DashboardCardProps) {
    const colors: Record<string, { border: string; icon: string; bg: string }> = {
        blue: { border: 'hover:border-blue-500', icon: 'text-blue-500', bg: 'bg-blue-50' },
        green: { border: 'hover:border-green-500', icon: 'text-green-500', bg: 'bg-green-50' },
        indigo: { border: 'hover:border-indigo-500', icon: 'text-indigo-500', bg: 'bg-indigo-50' },
        purple: { border: 'hover:border-purple-500', icon: 'text-purple-500', bg: 'bg-purple-50' },
        red: { border: 'hover:border-red-500', icon: 'text-red-500', bg: 'bg-red-50' },
        orange: { border: 'hover:border-orange-500', icon: 'text-orange-500', bg: 'bg-orange-50' },
    };

    return (
        <Link href={href} className="group block">
            <div className={`bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 ${colors[color].border} transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group-hover:scale-[1.02]`}>
                <div className={`mb-4 inline-flex p-4 ${colors[color].bg} rounded-2xl ${colors[color].icon} group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-gray-900 transition-colors">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{description}</p>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                    <span>عرض التفاصيل</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
}