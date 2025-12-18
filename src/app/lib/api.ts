import axios from "axios";
export const api = axios.create({
  baseURL: "http://127.0.0.1:3000",
  // baseURL: "https://belidjo-production.up.railway.app",
  timeout: 15000, // Augmenté pour les connexions lentes
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
