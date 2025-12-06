// Separate API service file

import axiosInstance from "../config/axiosInstance";
import endpoints from "../config/endpoints";

export const authAPI = {
  login: (credentials) => axiosInstance.post(endpoints.LOGIN, credentials),
  logout: () => axiosInstance.post(endpoints.LOGOUT),
  requestPasswordReset: (email) =>
    axiosInstance.post(endpoints.REQUEST_RESET_PASSWORD, { email }),
  verifyResetToken: (token) =>
    axiosInstance.get(`${endpoints.VERIFY_RESET_TOKEN}/${token}`),
  resetPassword: (data) => axiosInstance.post(endpoints.RESET_PASSWORD, data),
};

export const assignmentsAPI = {
  // GET /api/assignments
  // GET /api/assignments with optional params { page, limit }
  getAll: (params = {}) => axiosInstance.get(endpoints.ASSIGNMENTS, { params }),
  // GET /api/assignments/:id
  getOne: (id) => axiosInstance.get(`${endpoints.ASSIGNMENTS}/${id}`),
  // POST /api/assignments
  create: (assignmentData) =>
    axiosInstance.post(endpoints.ASSIGNMENTS, assignmentData),
  // PUT /api/assignments/:id
  update: (id, assignmentData) =>
    axiosInstance.put(`${endpoints.ASSIGNMENTS}/${id}`, assignmentData),
  // DELETE /api/assignments/:id
  delete: (id) => axiosInstance.delete(`${endpoints.ASSIGNMENTS}/${id}`),
};

export const batchesAPI = {
  // GET /api/batches with optional params { page, limit }
  getAll: (params = {}) => axiosInstance.get(endpoints.BATCHES, { params }),
  // GET /api/batches/:id
  getOne: (id) => axiosInstance.get(`${endpoints.BATCHES}/${id}`),
  // POST /api/batches
  create: (batchData) => axiosInstance.post(endpoints.BATCHES, batchData),
  // PUT /api/batches/:id
  update: (id, batchData) =>
    axiosInstance.put(`${endpoints.BATCHES}/${id}`, batchData),
  // DELETE /api/batches/:id
  delete: (id) => axiosInstance.delete(`${endpoints.BATCHES}/${id}`),
};

export default axiosInstance;
