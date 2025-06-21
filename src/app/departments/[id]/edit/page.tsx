'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import API from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, Save, ArrowRight, Hospital, Palette, Eye, EyeOff } from 'lucide-react';

interface StaffMember {
  doctor: {
    _id: string;
    fullName: string;
    id: string;
  };
  roleInDepartment: string;
  onDuty: boolean;
  _id: string;
}

interface Department {
  _id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  isAvailable: boolean;
  beds: {
    total: number;
    occupied: number;
  };
  staff: StaffMember[];
}
export default function EditDepartmentPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState<Department>({
        _id: '',
        name: '',
        description: '',
        icon: '',
        color: '#000000',
        isAvailable: false,
        beds: { total: 0, occupied: 0 },
        staff: [],
    });


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

useEffect(() => {
  const fetchDepartment = async () => {
    try {
      const res = await API.get(`/hospitals/departments/${params.id}`);
      const department = res.data.data || res.data;
      setForm({
        ...department,
        color: department.color ?? '#000000',
      });
      console.log('تم جلب بيانات القسم:', department);
    } catch (err) {
      console.error('فشل في جلب بيانات القسم', err);
    } finally {
      setLoading(false);
    }
  };

  fetchDepartment();
}, [params.id]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!form) return;
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value,
        });
    };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      // CORRECT: This path correctly resolves to /api/hospitals/departments/:id
      await API.put(`/hospitals/departments/${form._id}`, {
        name: form.name,
        icon: form.icon,
        color: form.color, // Make sure 'color' is in your Mongoose schema to save it
        isAvailable: form.isAvailable,
      });
      alert('تم حفظ التعديلات بنجاح');
      router.push('/dashboard');
    } catch (err) {
      console.error('فشل في التعديل', err);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-black mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-gray-600">يرجى تسجيل الدخول للوصول إلى هذه الصفحة</p>
        </div>
      </div>
    );
  }

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-black font-medium">جاري تحميل بيانات القسم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-black hover:text-blue-600 transition-colors mb-4 group"
          >
            <ArrowRight className="w-5 h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">العودة إلى لوحة التحكم</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Hospital className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">تعديل بيانات القسم</h1>
              <p className="text-gray-600 mt-1">قم بتحديث معلومات القسم الطبي</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  تفاصيل القسم
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Department Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-black font-semibold">
                    <Hospital className="w-4 h-4 text-blue-600" />
                    اسم القسم
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-black font-medium bg-gray-50 focus:bg-white"
                    placeholder="أدخل اسم القسم"
                    required
                  />
                </div>

                {/* FontAwesome Icon */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-black font-semibold">
                    <i className="fas fa-icons text-blue-600"></i>
                    أيقونة FontAwesome
                  </label>
                  <input
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-black font-medium bg-gray-50 focus:bg-white"
                    placeholder="مثال: fas fa-heart"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    استخدم كلاسات FontAwesome مثل: fas fa-heart, fas fa-user-md
                  </p>
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-black font-semibold">
                    <Palette className="w-4 h-4 text-blue-600" />
                    لون القسم
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      name="color"
                      type="color"
                      value={form.color}
                      onChange={handleChange}
                      className="h-12 w-20 border-2 border-gray-200 rounded-xl cursor-pointer"
                    />
                    <div className="flex-1">
                      <input
                        name="color"
                        type="text"
                        value={form.color}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-black font-medium bg-gray-50 focus:bg-white"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                  <div className="flex items-center gap-3">
                    {form.isAvailable ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <label className="text-black font-semibold cursor-pointer">
                        حالة القسم
                      </label>
                      <p className="text-sm text-gray-600">
                        {form.isAvailable ? 'القسم متاح للمرضى' : 'القسم غير متاح'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      name="isAvailable"
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Save className="w-5 h-5" />
                  {saving ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      جارٍ الحفظ...
                    </>
                  ) : (
                    'حفظ التعديلات'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                معاينة القسم
              </h3>
              
              <div className="space-y-4">
                {/* Department Card Preview */}
                <div 
                  className="p-4 rounded-xl border-2 transition-all duration-200"
                  style={{ 
                    borderColor: form.color,
                    backgroundColor: form.color + '10'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: form.color }}
                    >
                      <i className={form.icon || 'fas fa-hospital'}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-black">
                        {form.name || 'اسم القسم'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {form.isAvailable ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            متاح
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            غير متاح
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Info */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">اللون المحدد:</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border border-gray-200"
                      style={{ backgroundColor: form.color }}
                    ></div>
                    <span className="text-black font-mono text-sm">{form.color}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-black mb-3">نصائح مفيدة</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  استخدم ألوان واضحة ومتباينة لسهولة القراءة
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  تأكد من صحة كلاس FontAwesome المستخدم
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  يمكنك تعطيل القسم مؤقتاً عند الصيانة
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}