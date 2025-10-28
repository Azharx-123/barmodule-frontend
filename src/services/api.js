import axios from "axios";

// Base URL dari backend
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// User API
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  enrollCourse: (courseId) => api.post("/users/enroll", { courseId }),
};

// Course API
export const courseAPI = {
  getAll: () => api.get("/courses"),
  getBySlug: (slug) => api.get(`/courses/${slug}`),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

// Quiz API
export const quizAPI = {
  getByCourse: (courseId) => api.get(`/quiz/course/${courseId}`),
  submit: (data) => api.post("/quiz/submit", data),
  getResults: () => api.get("/quiz/results"),
};

// Contact API
export const contactAPI = {
  submit: (data) => api.post("/contact", data),
  getAll: () => api.get("/contact"),
  updateStatus: (id, status) => api.put(`/contact/${id}`, { status }),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
};

export default api;
