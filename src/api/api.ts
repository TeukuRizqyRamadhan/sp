import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API = axios.create({
  baseURL: "http://192.168.7.109:3000/",
  headers: { "Content-Type": "application/json" },
});

// Tambahkan token ke setiap request
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
