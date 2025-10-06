import axios, { AxiosError } from 'axios';

const FALLBACK_API_URL = 'https://server-ambulance.onrender.com/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL1 || FALLBACK_API_URL;

console.log('API Base URL is (Resolved):', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const requestUrl = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`;

        console.error(
            `API Request Failed at URL: ${requestUrl}`,
            `Status: ${error.response?.status || 'Network Error'}`,
            `Message: ${error.message}`,
            error
        );
        return Promise.reject(error);
    }
);

export default api;
