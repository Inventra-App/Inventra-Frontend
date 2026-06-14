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

// Read the auth token from localStorage. Supports a few common key names
// so we don't break if the login response was saved under a different field.
const getStoredToken = () => {
  return (
    localStorage.getItem("inventra_token") ||
    localStorage.getItem("inventra_access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
};

// Attach the auth token (if any) to every request.
API.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor: on 401 (token rejected / expired) we
// automatically clear the local session so the user isn't trapped with a
// stale token. The component can still handle 401s specifically if needed.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token is invalid or expired — wipe it so the next request is
      // anonymous (e.g. login). Don't redirect automatically here because
      // the caller may want to handle it (e.g. show a toast on the login
      // page where a 401 is expected when credentials are wrong).
      localStorage.removeItem("inventra_token");
      localStorage.removeItem("inventra_access_token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default API;
