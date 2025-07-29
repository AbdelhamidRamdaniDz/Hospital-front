// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true,
// });

// export default API;

import axios from 'axios';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.error("API_BASE_URL is not defined! Please check your next.config.js or .env.local");
}

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default API;
