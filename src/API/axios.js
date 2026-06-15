import axios from "axios";

// Shared axios instance for the whole app.
//
// Why a timeout?
// Our backend (Render free tier) spins down after inactivity, so the first
// request after a while can take 30-60s to wake it up. Without a timeout the
// browser will eventually give up with `net::ERR_TIMED_OUT` and the user sees
// a confusing error. With a 30s timeout we fail fast and can show a clear
// "server is waking up, please try again" message.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("inventra_token"); 
  console.log("Sending Token:", token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default API;
