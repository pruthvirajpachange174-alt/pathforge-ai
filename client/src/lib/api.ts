/** Shared HTTP client; keeps Clerk auth attached to API requests. */
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function attachToken(getToken: () => Promise<string | null>) {
  const interceptorId = api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Eject on provider cleanup so Strict Mode remounts don't stack interceptors.
  return () => api.interceptors.request.eject(interceptorId);
}
