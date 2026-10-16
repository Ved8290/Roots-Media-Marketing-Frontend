import { http } from './client';

export const taskApi = {
  list: (params) => http.get('/tasks', { params }).then((res) => res.data),
  get: (id) => http.get(`/tasks/${id}`).then((res) => res.data.data),
  create: (payload) => http.post('/tasks', payload).then((res) => res.data),
  update: (id, payload) => http.put(`/tasks/${id}`, payload).then((res) => res.data),
  updateStatus: (id, status) => http.put(`/tasks/${id}/status`, { status }).then((res) => res.data),
  remove: (id) => http.delete(`/tasks/${id}`).then((res) => res.data),
  exportCsv: (params) => http.get('/tasks/export', { params, responseType: 'blob' }),
};
