import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_HOST || 'http://localhost:11000',
    timeout: 15000,
});