import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:3005",
});

if (typeof window !== "undefined") {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
