'use client';
import { Hospital } from 'lucide-react';

export default function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
            <div className="text-center bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    <Hospital className="absolute inset-0 m-auto w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">جاري تحميل لوحة التحكم</h3>
                <p className="text-gray-600">يرجى الانتظار...</p>
            </div>
        </div>
    );
}