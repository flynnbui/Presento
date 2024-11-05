import axios, { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig  } from "axios";

const baseUrl = "localhost:5005";
const config: AxiosRequestConfig = {
  baseURL: baseUrl,
};

const api = axios.create(config);

const handleBefore = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
  // CONFIG API NO TOKEN
  const noAuthEndpoints = ["/admin/auth/register", "/admin/auth/login"];
  const requiresAuth = !noAuthEndpoints.some((endpoint) => 
    config.url && config.url.includes(endpoint)
  );
  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers;
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      return Promise.reject("No token provided!");
    }
  }
  return config;
};

// Define types for the error handling function
const handleError = (error: AxiosError) => {
  console.error("Request Error: ", error);
  return Promise.reject(error);
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
