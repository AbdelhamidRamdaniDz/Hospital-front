'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import API from '@/lib/axios';
import Link from 'next/link';

interface Department {
  _id: string;
  name: string;
  icon: string;
  color: string;
  staff: StaffMember[];
}

interface Doctor {
  fullName: string;
}

interface StaffMember {
  doctor: Doctor;
  roleInDepartment: string;
  onDuty: boolean;
}

export default function ManageDepartmentsPage() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState({ name: '', icon: '', color: '#1976d2' });
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await API.get('/hospitals/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('فشل في جلب الأقسام', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.icon) return;
    setLoading(true);
    try {
      await API.post('/hospitals/departments', form);
      setForm({ name: '', icon: '', color: '#1976d2' });
      fetchDepartments();
    } catch (err) {
      console.error('فشل في الإضافة', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-10">يرجى تسجيل الدخول</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">إدارة الأقسام</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow p-5 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">إضافة قسم جديد</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="name" placeholder="اسم القسم" value={form.name} onChange={handleChange} className="border p-2 rounded" required />
          <input name="icon" placeholder="أيقونة FontAwesome" value={form.icon} onChange={handleChange} className="border p-2 rounded" required />
          <input name="color" type="color" value={form.color} onChange={handleChange} className="border p-2 rounded h-[44px]" />
        </div>
        <button disabled={loading} type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {loading ? 'جاري الإضافة...' : 'إضافة'}
        </button>
      </form>

      <div className="bg-white shadow p-5 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">الأقسام الحالية</h2>
        {departments.length === 0 ? (
          <p className="text-gray-500">لا توجد أقسام بعد.</p>
        ) : (
          <ul className="space-y-4">
            {departments.map((dept) => (
              <li key={dept._id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center text-white rounded" style={{ backgroundColor: dept.color }}>
                    <i className={`fas fa-${dept.icon}`}></i>
                  </div>
                  <div>
                    <div className="font-bold">{dept.name}</div>
                    <small className="text-gray-500">عدد الطاقم: {dept.staff?.length || 0}</small>
                  </div>
                </div>
                <Link
                  href={`/departments/${dept._id}`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  عرض التفاصيل
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
