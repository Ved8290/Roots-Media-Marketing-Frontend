import { http } from './client';

export const dashboardApi = {
  get: () => http.get('/dashboard').then((res) => res.data.data),
};
