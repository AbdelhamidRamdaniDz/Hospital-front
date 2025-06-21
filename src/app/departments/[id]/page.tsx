'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import API from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Doctor {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
}

interface StaffMember {
  _id: string;
  doctor: Doctor;
  roleInDepartment: string;
  onDuty: boolean;
}

interface Department {
  _id: string;
  name: string;
  icon: string;
  color: string;
  isAvailable: boolean;
  staff: StaffMember[];
}

export default function DepartmentDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const staffRoles = ['رئيس قسم', 'مناوب', 'تحت الطلب', 'أخصائي'];
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null); 
  const [editFormData, setEditFormData] = useState({ roleInDepartment: '', onDuty: false });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [deptRes, docsRes] = await Promise.all([
          API.get(`/hospitals/departments/${params.id}`),
          API.get(`/hospitals/doctors`),
        ]);
        setDepartment(deptRes.data);
        setDoctors(docsRes.data.data || []);
      } catch (err) {
        console.error('فشل في الجلب', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [params.id]);

  // ✅ الخطوة 2: أضف هذه الدوال الجديدة

// دالة لحذف موظف من القسم
const handleDeleteStaff = async (staffId: string) => {
    // رسالة تأكيد قبل الحذف
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الطبيب من القسم؟')) {
        return;
    }
    try {
        await API.delete(`/hospitals/departments/${params.id}/staff/${staffId}`);
        alert('تم حذف الطبيب من القسم بنجاح.');
        window.location.reload(); // أسهل طريقة لتحديث الواجهة
    } catch (err) {
        console.error('فشل في الحذف', err);
        alert('حدث خطأ أثناء الحذف.');
    }
};

// دالة لتفعيل وضع التعديل
const handleEditClick = (staffMember: StaffMember) => {
    setEditingStaffId(staffMember._id); // لاحظ أننا نحتاج إلى _id للموظف
    setEditFormData({
        roleInDepartment: staffMember.roleInDepartment,
        onDuty: staffMember.onDuty,
    });
};

// دالة لإلغاء وضع التعديل
const handleCancelClick = () => {
    setEditingStaffId(null);
};

// دالة لتحديث بيانات النموذج أثناء التعديل
const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setEditFormData(prev => ({
        ...prev,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
};

// دالة لحفظ التعديلات
const handleUpdateSubmit = async (staffId: string) => {
    try {
        await API.put(`/hospitals/departments/${params.id}/staff/${staffId}`, editFormData);
        alert('تم تحديث البيانات بنجاح.');
        setEditingStaffId(null); // اخرج من وضع التعديل
        window.location.reload(); // تحديث الواجهة
    } catch (err) {
        console.error('فشل في التحديث', err);
        alert('حدث خطأ أثناء تحديث البيانات.');
    }
};

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
        <div className="bg-gray-50 p-8 rounded-2xl shadow-lg text-center border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <i className="fas fa-user-lock text-red-500 text-2xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-black mb-2">يرجى تسجيل الدخول</h3>
          <p className="text-gray-700">تحتاج إلى تسجيل الدخول للوصول إلى هذه الصفحة</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-semibold text-black">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
        <div className="bg-gray-50 p-8 rounded-2xl shadow-lg text-center border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-black mb-2">القسم غير موجود</h3>
          <p className="text-gray-700">لا يمكن العثور على القسم المطلوب</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-gray-50 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-6">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transform hover:scale-105 transition-transform duration-200" 
                style={{ backgroundColor: department.color }}
              >
                <i className={`fas fa-${department.icon} text-2xl`}></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">{department.name}</h1>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${department.isAvailable ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  <span className={`text-sm font-medium ${department.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {department.isAvailable ? 'القسم متاح' : 'القسم مغلق'}
                  </span>
                </div>
              </div>
            </div>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-xl transition-colors duration-200 font-medium"
            >
              <i className="fas fa-arrow-left"></i>
              الرجوع
            </Link>
          </div>
        </div>

        {/* Staff Section */}
        <div className="bg-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-l from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-users text-white text-lg"></i>
              </div>
              <h2 className="text-xl font-bold text-white">قائمة الطاقم الطبي</h2>
            </div>
          </div>
          
          <div className="p-6">
            {department.staff.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full" dir="rtl">
                      <thead>
                      <tr className="border-b border-gray-200">
                          <th className="text-right py-4 px-4 font-semibold text-black">الاسم</th>
                          <th className="text-right py-4 px-4 font-semibold text-black">الهاتف</th>
                          <th className="text-right py-4 px-4 font-semibold text-black">البريد الإلكتروني</th>
                          <th className="text-right py-4 px-4 font-semibold text-black">الدور</th>
                          <th className="text-right py-4 px-4 font-semibold text-black">الحالة</th>
                          <th className="text-center py-4 px-4 font-semibold text-black">الإجراءات</th>
                      </tr>
                  </thead>
                <tbody>
                    {department.staff.map((m) => (
                        <tr key={m._id} className="hover:bg-gray-100 transition-colors duration-200 border-b border-gray-100 last:border-b-0">
                            {editingStaffId === m._id ? (
                                <>
                                    {/* === وضع التعديل === */}
                                    <td className="py-4 px-4" colSpan={3}>
                                        <div className="font-medium text-black">{m.doctor.fullName}</div>
                                        <div className="text-sm text-gray-500">(لا يمكن تعديل بيانات الطبيب الأساسية هنا)</div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <select 
                                            name="roleInDepartment" 
                                            value={editFormData.roleInDepartment}
                                            onChange={handleEditFormChange}
                                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
                                        >
                                            {staffRoles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-4 px-4">
                                        <input 
                                            type="checkbox" 
                                            name="onDuty"
                                            checked={editFormData.onDuty}
                                            onChange={handleEditFormChange}
                                            className="w-5 h-5"
                                        />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <button onClick={() => handleUpdateSubmit(m._id)} className="text-green-600 hover:text-green-800"><i className="fas fa-check"></i> حفظ</button>
                                            <button onClick={handleCancelClick} className="text-gray-600 hover:text-gray-800"><i className="fas fa-times"></i> إلغاء</button>
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    {/* === وضع العرض العادي === */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {m.doctor.fullName.charAt(0)}
                                            </div>
                                            <span className="font-medium text-black">{m.doctor.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-black">{m.doctor.phone}</td>
                                    <td className="py-4 px-4 text-black">{m.doctor.email}</td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            {m.roleInDepartment}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {m.onDuty ? (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                مناوب
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                غير مناوب
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex justify-center items-center gap-4">
                                            <button onClick={() => handleEditClick(m)} className="text-blue-600 hover:text-blue-800" title="تعديل">
                                                <i className="fas fa-pencil-alt"></i> تعديل  {/* <-- أضفنا كلمة "تعديل" */}
                                            </button>
                                            <button onClick={() => handleDeleteStaff(m._id)} className="text-red-600 hover:text-red-800" title="حذف">
                                                <i className="fas fa-trash-alt"></i> حذف   {/* <-- أضفنا كلمة "حذف" */}
                                            </button>
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <i className="fas fa-user-friends text-gray-500 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">لا يوجد طاقم طبي</h3>
                <p className="text-gray-600">لم يتم تعيين أي طبيب في هذا القسم بعد</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Doctor Section */}
        <div className="bg-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-l from-green-600 to-emerald-600 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-user-plus text-white text-lg"></i>
              </div>
              <h2 className="text-xl font-bold text-white">إضافة طبيب إلى القسم</h2>
            </div>
          </div>
          
          <div className="p-6">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const body = {
                  doctorId: formData.get('doctorId'),
                  roleInDepartment: formData.get('roleInDepartment'), // القيمة ستأتي الآن من القائمة المنسدلة وستكون صحيحة دائمًا
                  onDuty: formData.get('onDuty') === 'on',
                };
                console.log('البيانات التي سيتم إرسالها:', body);
                try {
                  await API.post(`/hospitals/departments/${params.id}/staff`, body);
                  alert('تمت الإضافة بنجاح');
                  window.location.reload(); // إعادة تحميل الصفحة لإظهار الطبيب الجديد
                } catch (err) {
                  console.error('فشل في الإضافة', err);
                  alert('فشل في الإضافة. تأكد من أن الطبيب غير مضاف مسبقًا.');
                }
              }}
              className="space-y-6"
              dir="rtl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-black mb-2">
                    <i className="fas fa-user-md mr-2 text-gray-500"></i>
                    اختيار الطبيب
                  </label>
                  <select 
                    name="doctorId" 
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-black"
                    required
                  >
                    <option value="">اختر طبيبًا</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>{doc.fullName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-black mb-2">
                        <i className="fas fa-briefcase mr-2 text-gray-500"></i>
                        الدور في القسم
                    </label>
                    <select 
                        name="roleInDepartment" 
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-black"
                        required
                    >
                        <option value="">-- اختر الدور --</option>
                        {staffRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-black mb-2">
                    <i className="fas fa-clock mr-2 text-gray-500"></i>
                    حالة المناوبة
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                    <input type="checkbox" name="onDuty" className="mr-3 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                    <span className="text-black font-medium">مناوب حاليًا</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-start pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-l from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <i className="fas fa-plus"></i>
                  إضافة للطاقم
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}