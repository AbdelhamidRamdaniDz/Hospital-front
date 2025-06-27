'use client';
import Link from 'next/link';
import { AlertCircle, Shield } from 'lucide-react';

export default function AuthRequired() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
            <div className="text-center bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-md">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">تسجيل الدخول مطلوب</h3>
                <p className="text-gray-600 mb-6">يرجى تسجيل الدخول للوصول إلى لوحة التحكم</p>
                <Link href="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Shield className="w-5 h-5" />
                    الذهاب لصفحة الدخول
                </Link>
            </div>
        </div>
    );
}