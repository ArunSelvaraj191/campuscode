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

export default axiosInstance;
