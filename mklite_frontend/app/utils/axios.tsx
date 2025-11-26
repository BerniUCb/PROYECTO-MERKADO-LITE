import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:3005",
});

// ⚠️ SOLO agregar el interceptor si estamos en el navegador
if (typeof window !== "undefined") {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
