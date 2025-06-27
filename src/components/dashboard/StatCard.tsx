'use client';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: string;
    trend?: string;
}

export default function StatCard({ icon, label, value, color, trend }: StatCardProps) {
    const colors: Record<string, { bg: string; text: string; accent: string }> = {
        blue: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', accent: 'bg-blue-50' },
        green: { bg: 'from-green-500 to-green-600', text: 'text-green-600', accent: 'bg-green-50' },
        teal: { bg: 'from-teal-500 to-teal-600', text: 'text-teal-600', accent: 'bg-teal-50' },
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${colors[color].bg} text-white shadow-lg`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[color].accent} ${colors[color].text}`}>
                        {trend}
                    </div>
                )}
            </div>
            <div className="text-3xl font-bold text-black mb-1">{value}</div>
            <div className="text-gray-600">{label}</div>
        </div>
    );
}