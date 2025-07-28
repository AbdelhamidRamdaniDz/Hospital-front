 /*import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  config options here 
};
*/
export default nextConfig;
// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // لا تضع output: 'export' هنا إذا كنت تريد استخدام SSR أو API Routes
  // إذا كنت تستخدم App Router (في Next.js 13+ أو 14+ أو 15+):
  // experimental: {
  //   appDir: true, // تأكد من وجود هذا إذا كان تطبيقك يستخدم App Router
  // },
  // إذا كانت لديك صور في مجلد public وتريد تحسينها
  images: {
    // يمكنك إعداد domains هنا للصور الخارجية
    // domains: ['example.com'],
    // أو إذا كنت تواجه مشاكل في التحسين على Vercel، يمكنك إيقافه مؤقتًا
    // unoptimized: true,
  },
  // هنا نقوم بتحديد متغيرات البيئة العامة التي يمكن الوصول إليها في المتصفح
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.biocarealgeria.com/api', // هذا هو عنوان URL للواجهة الخلفية على cPanel
  },
};

export default nextConfig;
