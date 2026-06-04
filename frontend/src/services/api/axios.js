import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: '/api/',
  withCredentials: true,
});

/** resolveBackendOrigin sonrası çağrılır (main.jsx). */
export function applyBackendConfig(apiBaseURL) {
  axiosInstance.defaults.baseURL = apiBaseURL;
}

export default axiosInstance; 
