import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//Interceptor, runs before every request, so we add our token here
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// LOGIN API
export const authAPI = {
  login: async (email, password) => {
    const res = await api.post('/login', {
      email,
      password,
    });

    return res.data;
  },
};

export const historyAPI = {
    getHistory: async () => {
        const res = await api.get('/history');
        return res.data;
    },
    saveHistory: async (ipAddress, geodata) => {
        const res = await api.post('/history', {
            ip_address: ipAddress,
            geodata: geodata
        });
        return res.data;
    }
};

export const getGeoData = async (ip = '') => {
    try {
        const url = ip ? `https://ipinfo.io/${ip}/geo` : 'https://ipinfo.io/geo';
        const res = await axios.get(url);
        return res.data
    } catch (err) {
        throw new Error('Failed to fetch data', err);
    }
}

export default api;