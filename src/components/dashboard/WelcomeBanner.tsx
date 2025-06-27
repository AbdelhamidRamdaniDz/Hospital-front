'use client';
import { Clock } from 'lucide-react';

export default function WelcomeBanner() {
    return (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6" />
                    <span className="text-blue-100">
                        {new Date().toLocaleDateString('ar-EG', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </span>
                </div>
                <h2 className="text-3xl font-bold mb-2">مرحباً بعودتك!</h2>
                <p className="text-blue-100 text-lg">إليك نظرة عامة على أداء المستشفى اليوم</p>
            </div>
        </div>
    );
}