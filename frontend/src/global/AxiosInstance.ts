import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_HOST || 'http://localhost:11000/api/v1',
    timeout: 15000,
});