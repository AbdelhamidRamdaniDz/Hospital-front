'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import API from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

interface Case {
  _id: string;
  name: string;
  condition: string;
  createdAt: string;
  location: {
    lat: number;
    lng: number;
  };
  paramedic: {
    fullName: string;
    phone: string;
  };
}

const DynamicHospitalMapComponent = dynamic(
  () => import('@/components/HospitalMapComponent'),
  {
    ssr: false, 
    loading: () => <div className="h-[80vh] flex items-center justify-center text-gray-500">جاري تحميل الخريطة...</div>,
  }
);

export default function HospitalCasesMapPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await API.get('/api/hospitals/cases');
        setCases(res.data);
      } catch (err) {
        console.error('خطأ في جلب الحالات', err);
      }
    };

    if (user) {
      fetchCases();
    }
  }, [user]);

  const center = useMemo(() => {
    return cases.length > 0 ? [cases[0].location.lat, cases[0].location.lng] : [34.85, 2.88];
  }, [cases]);

  if (!user) return <div className="text-center mt-10">يرجى تسجيل الدخول</div>;

  return (
    <div className="h-screen p-4">
      <h1 className="text-xl font-bold mb-4 text-gray-700">خريطة الحالات المرتبطة بمستفاك</h1>

      <DynamicHospitalMapComponent cases={cases} center={center as [number, number]} />
    </div>
  );
}