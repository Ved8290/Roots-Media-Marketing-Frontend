import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const http = axios.create({ baseURL, timeout: 20000 });

// Turn every failure into an Error with a friendly message taken from the server response
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    let body = error.response?.data;
    if (body instanceof Blob) {
      try {
        body = JSON.parse(await body.text());
      } catch {
        body = null;
      }
    }

    const fallback =
      error.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : 'Cannot reach the server. Please check your connection and try again.';

    const friendly = new Error(body?.message || fallback);
    friendly.status = error.response?.status;
    friendly.fieldErrors = body?.errors || [];
    return Promise.reject(friendly);
  }
);
