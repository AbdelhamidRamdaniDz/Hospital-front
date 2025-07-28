// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true,
// });

// export default API;

// lib/axios.ts (أو lib/axios.js)
import axios from 'axios';

// استخدام متغير البيئة الذي تم تعريفه في next.config.js و .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// تأكد من أن API_BASE_URL له قيمة، وإلا فسيواجه مشكلة في الإنتاج
if (!API_BASE_URL) {
  console.error("API_BASE_URL is not defined! Please check your next.config.js or .env.local");
  // يمكنك إما إرجاع خطأ أو تعيين قيمة افتراضية هنا
  // مثال: API_BASE_URL = '/api'; // إذا كانت الواجهة الخلفية في نفس النطاق
}

const API = axios.create({
  baseURL: API_BASE_URL, // الآن سيتم جلب القيمة من المتغير
  withCredentials: true,
});

export default API;
