import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api-lamsa.sadiq-store.com",
  // allow sending HttpOnly cookies from the backend (sameSite & CORS must allow)
  withCredentials: true,
});

// Optional: attach Authorization header if a token is available in localStorage
// (prefer HttpOnly cookie for security; this is a fallback for API clients that
// expect Bearer tokens). If you don't want this behavior, remove the interceptor.
axiosInstance.interceptors.request.use((config) => {
  try {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (stored && config && config.headers) {
      config.headers["Authorization"] = `Bearer ${stored}`;
    }
  } catch (e) {
    // ignore (server or disabled storage)
  }
  return config;
});

export default axiosInstance;
