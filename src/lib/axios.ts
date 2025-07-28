// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true,
// });

// export default API;

import axios from 'axios';

// استخدم متغير البيئة NEXT_PUBLIC_API_URL
// هذا المتغير سيتم تعيينه في next.config.js (للبناء المحلي) وعلى Vercel (للنشر)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API = axios.create({
  baseURL: API_BASE_URL, // تم التغيير هنا
  withCredentials: true,
});

export default API;
