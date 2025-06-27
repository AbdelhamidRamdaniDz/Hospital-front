'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

useEffect(() => {
  if (user) {
    router.push('/dashboard');
  }
}, [user, router]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-green-50 text-gray-800 px-6 py-12">
      <div className="text-center space-y-6 max-w-xl">
        <Image src="/logo.lnk" alt="شعار النظام" width={100} height={100} className="mx-auto" />

        <h1 className="text-3xl font-bold text-blue-800">مرحبًا بك في نظام إدارة الطوارئ الصحية</h1>
        <p className="text-lg text-gray-600">
          منصة مخصصة لربط المسعفين، المستشفيات، والإدارة الصحية لتتبع الحالات وتنظيم المناوبات بكفاءة.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/login" passHref legacyBehavior>
            <a className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow text-sm">
              تسجيل الدخول
            </a>
          </Link>

        </div>
      </div>

      <footer className="mt-20 text-sm text-gray-400">
        © {new Date().getFullYear()} نظام الطوارئ الصحية. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}
