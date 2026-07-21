import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

export const checkHealth = () => api.get('/health');
export const getDashboard = () => {
    console.log("API CALLED");
    return api.get("/dashboard");
};
export const getForecast = () => api.get('/forecast');
export const predictNews = (payload) => api.post('/predict', payload);
