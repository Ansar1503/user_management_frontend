import axios, { AxiosInstance } from "axios";

const baseURL = import.meta.env.VITE_AXIOS_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      try {
        await axiosInstance.post('/refresh');
        return axiosInstance(originalRequest); 
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); 
  }
);

export default axiosInstance;
