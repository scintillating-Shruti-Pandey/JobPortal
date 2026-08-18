import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('nestwork_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nestwork_token');
      localStorage.removeItem('nestwork_user');
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  googleLogin: () => { window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`; },
};

// Jobs
export const jobsAPI = {
  getAll: (params) => API.get('/jobs', { params }),
  getFeatured: () => API.get('/jobs/featured'),
  getStats: () => API.get('/jobs/stats'),
  getById: (id) => API.get(`/jobs/${id}`),
  create: (data) => API.post('/jobs', data),
  update: (id, data) => API.put(`/jobs/${id}`, data),
  delete: (id) => API.delete(`/jobs/${id}`),
  getMyJobs: () => API.get('/jobs/my-jobs'),
};

// Applications
export const applicationsAPI = {
  apply: (jobId, data) => API.post(`/applications/${jobId}`, data),
  getMyApplications: () => API.get('/applications/me'),
  getJobApplicants: (jobId) => API.get(`/applications/job/${jobId}`),
  updateStatus: (id, data) => API.put(`/applications/${id}/status`, data),
  toggleSave: (jobId) => API.post(`/applications/save/${jobId}`),
};

export default API;
