import { http } from './client';

export const employeeApi = {
  list: (params) => http.get('/employees', { params }).then((res) => res.data),
  options: (params) => http.get('/employees/options', { params }).then((res) => res.data.data),
  get: (id) => http.get(`/employees/${id}`).then((res) => res.data.data),
  create: (payload) => http.post('/employees', payload).then((res) => res.data),
  update: (id, payload) => http.put(`/employees/${id}`, payload).then((res) => res.data),
  remove: (id) => http.delete(`/employees/${id}`).then((res) => res.data),
};
