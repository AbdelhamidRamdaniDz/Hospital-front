 /*import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  config options here 
};
*/
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // (بقية التكوين الخاص بك هنا، لا تضع output: 'export' إذا كنت تستخدم SSR)

  // تعريف متغيرات البيئة التي ستكون متاحة في كود الواجهة الأمامية
  env: {
    NEXT_PUBLIC_API_URL: 'https://biocarealgeria.com/api',
  },

  // إذا كنت تستخدم App Router (في Next.js 13+):
  // experimental: {
  //   appDir: true,
  // },
  // إذا كانت لديك صور في مجلد public وتريد تحسينها
  // images: {
  //   // يمكنك إعداد domains هنا للصور الخارجية
  //   // domains: ['example.com'],
  //   // unoptimized: true, // إذا كنت تواجه مشاكل في التحسين
  // },
};

export default nextConfig;
