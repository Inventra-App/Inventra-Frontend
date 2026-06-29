import axios from "axios";
import { getLoginPathForRole } from "../Utils/authRoles";
import { getSessionUser } from "../Utils/sessionUser";
import { clearAuthStorage, setSessionExpiredMessage } from "../Utils/authSession";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("inventra_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadSessionToken = Boolean(sessionStorage.getItem("inventra_token"));

    if (error?.response?.status === 401 && hadSessionToken) {
      const sessionUser = getSessionUser();

      const role = sessionUser?.role || "cashier";
      const loginPath = getLoginPathForRole(role);

      setSessionExpiredMessage();

      const currentPath = window.location.pathname;

      const isAlreadyLoginPage =
        currentPath.includes("login") || currentPath === loginPath;

      if (!isAlreadyLoginPage) {
        clearAuthStorage();
        window.location.replace(loginPath);
      }
    }

    return Promise.reject(error);
  }
);

export default API;