'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  Ambulance, 
  Hospital, 
  Shield, 
  Clock, 
  MapPin, 
  Activity, 
  Users, 
  ChevronRight,
  Phone,
  FileText,
  CheckCircle,
  Stethoscope
} from 'lucide-react';

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="text-blue-500 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center leading-relaxed">{description}</p>
    </div>
  );
}

function WorkStep({ number, icon, title, description }: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="relative mb-4">
        <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
          {number}
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-blue-500">
          {icon}
        </div>
      </div>
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

// المكون الرئيسي
export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse gap-1">
            <Image 
              src="/URGO-white.jpeg" 
              alt="شعار URGO" 
              width={60} 
              height={60} 
              className="rounded-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              URGO
            </span>
          </div>
          <Link 
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            تسجيل الدخول
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-gray-50 to-blue-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              نظام إدارة الطوارئ الصحية
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            حل متكامل وذكي يربط المسعفين بالمستشفيات لضمان الاستجابة السريعة والفعالة للحالات الطارئة، 
            مما يساهم في إنقاذ الأرواح وتحسين جودة الرعاية الصحية.
          </p>
          <Link 
            href="/login"
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-3"
          >
            <Activity className="w-6 h-6" />
            ابدأ الآن
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              لماذا URGO هو الحل الأمثل؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نظام متطور يجمع بين التقنية الحديثة والخبرة الطبية لتوفير أفضل خدمة للطوارئ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clock className="w-12 h-12" />}
              title="تنسيق فوري"
              description="ربط مباشر ولحظي بين المسعفين والمستشفيات يقلل من وقت الاستجابة ويضمن وصول الحالات للمكان المناسب"
            />
            <FeatureCard
              icon={<Activity className="w-12 h-12" />}
              title="بيانات لحظية"
              description="معلومات محدثة باستمرار عن حالة المستشفيات وتوفر الأسرة والطواقم الطبية لاتخاذ قرارات مدروسة"
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12" />}
              title="إدارة شاملة"
              description="لوحة تحكم متقدمة للمسؤولين لمراقبة النظام وإدارة المستخدمين والحصول على تحليلات مفصلة"
            />
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              icon={<Ambulance className="w-12 h-12" />}
              title="للمسعفين"
              description="تطبيق محمول سهل الاستخدام مع خريطة تفاعلية وإمكانية إرسال معلومات الحالات بسرعة"
            />
            <FeatureCard
              icon={<Hospital className="w-12 h-12" />}
              title="للمستشفيات"
              description="نظام ويب متكامل لإدارة الأقسام والطواقم واستقبال الحالات الطارئة بكفاءة"
            />
            <FeatureCard
              icon={<Users className="w-12 h-12" />}
              title="للجهات الإدارية"
              description="أدوات تحليلية متقدمة لمراقبة الأداء والتخطيط للطوارئ وتحسين الخدمات الصحية"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              آلية عمل النظام في 4 خطوات
            </h2>
            <p className="text-xl text-gray-600">
              عملية مبسطة وفعالة لضمان أسرع استجابة ممكنة
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <WorkStep
              number="1"
              icon={<Phone className="w-6 h-6" />}
              title="استقبال البلاغ"
              description="المسعف يتلقى بلاغ الطوارئ ويتوجه إلى موقع الحادث"
            />
            <WorkStep
              number="2"
              icon={<MapPin className="w-6 h-6" />}
              title="اختيار المستشفى"
              description="عرض خريطة تفاعلية لاختيار أقرب مستشفى متاح ومناسب للحالة"
            />
            <WorkStep
              number="3"
              icon={<FileText className="w-6 h-6" />}
              title="إرسال المعلومات"
              description="تسجيل وإرسال بيانات المريض والحالة الطبية فورياً للمستشفى"
            />
            <WorkStep
              number="4"
              icon={<CheckCircle className="w-6 h-6" />}
              title="الاستعداد والاستقبال"
              description="المستشفى يتلقى المعلومات ويجهز الفريق الطبي لاستقبال الحالة"
            />
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              <Stethoscope className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                جاهز لتحسين خدمات الطوارئ؟
              </h3>
              <p className="text-gray-600 mb-6">
                انضم إلى آلاف المستخدمين الذين يثقون في نظام URGO لإدارة الطوارئ الطبية
              </p>
              <Link 
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-all duration-300"
              >
                <Activity className="w-5 h-5" />
                ابدأ التجربة المجانية
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse gap-1 mb-4 md:mb-0">
              <Image 
                src="/URGO-white.jpeg" 
                alt="شعار URGO" 
                width={32} 
                height={32} 
                className="rounded"
              />
              <span className="text-xl font-bold">URGO</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-300">
                © {new Date().getFullYear()} نظام URGO - إدارة الطوارئ الطبية. جميع الحقوق محفوظة.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                تحويل الاستجابة للطوارئ إلى نظام رقمي ذكي وفوري
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}