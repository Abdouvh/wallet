import axios from 'axios';

// 1. Create the Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Matches your Spring Boot Controller
});

// 2. Add an "Interceptor" to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;