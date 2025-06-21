'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import API from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import L from 'leaflet';

// التحميل الديناميكي لتفادي SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

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

    fetchCases();
  }, []);

  const center = cases.length > 0 ? [cases[0].location.lat, cases[0].location.lng] : [34.85, 2.88]; // مركز الخريطة

  if (!user) return <div className="text-center mt-10">يرجى تسجيل الدخول</div>;

  return (
    <div className="h-screen p-4">
      <h1 className="text-xl font-bold mb-4 text-gray-700">خريطة الحالات المرتبطة بمستشفاك</h1>

      <MapContainer center={center as [number, number]} zoom={10} className="h-[80vh] rounded shadow border">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {cases.map((c) => (
          <Marker
            key={c._id}
            position={[c.location.lat, c.location.lng]}
            icon={L.icon({
              iconUrl: '/marker-icon.png', // استخدم أيقونة مخصصة إذا أحببت
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })}
          >
            <Popup>
              <strong>{c.name}</strong> <br />
              الحالة: {c.condition} <br />
              المسعف: {c.paramedic.fullName} <br />
              📞 {c.paramedic.phone} <br />
              🕒 {new Date(c.createdAt).toLocaleString('ar-DZ')}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
