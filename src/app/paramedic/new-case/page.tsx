'use client';
import { useEffect, useState } from 'react';
import API from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

interface Hospital {
  _id: string;
  name: string;
  // يمكنك إضافة خصائص أخرى لاحقًا مثل `location` أو `address` إن وُجدت
}


export default function NewCasePage() {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('المتصفح لا يدعم تحديد الموقع');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => alert('فشل في تحديد الموقع: ' + err.message)
    );

    const fetchHospitals = async () => {
      try {
        const res = await API.get('/hospitals');
        setHospitals(res.data);
      } catch (err) {
        console.error('خطأ في جلب المستشفيات', err);
      }
    };

    fetchHospitals();
  }, []);

  if (!user) return <div className="text-center mt-10">يرجى تسجيل الدخول</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 shadow rounded">
      <h1 className="text-xl font-bold mb-4 text-gray-700">إنشاء حالة جديدة</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);

          const body = {
            name: formData.get('name'),
            age: Number(formData.get('age')),
            condition: formData.get('condition'),
            hospitalId: formData.get('hospitalId'),
            location,
          };

          try {
            await API.post('/api/paramedic/cases', body);
            alert('تم إرسال الحالة بنجاح');
            form.reset();
          } catch (err) {
            console.error('خطأ في إرسال الحالة', err);
            alert('فشل في إرسال الحالة');
          }
        }}
        className="grid gap-4"
      >
        <input name="name" placeholder="اسم المريض" className="p-2 border rounded" required />
        <input type="number" name="age" placeholder="العمر" className="p-2 border rounded" required />
        <input name="condition" placeholder="الحالة الطبية" className="p-2 border rounded" required />

        <select name="hospitalId" className="p-2 border rounded" required>
          <option value="">اختر مستشفى</option>
          {hospitals.map((h) => (
            <option key={h._id} value={h._id}>{h.name}</option>
            ))}
        </select>

        <button
          type="submit"
          disabled={!location}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {location ? 'إرسال الحالة' : 'جاري تحديد الموقع...'}
        </button>
      </form>
    </div>
  );
}
