const API_URL = "http://localhost:5000/api";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    // Store token in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No active session");
    }

    const response = await fetch(`${API_URL}/users/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Logout failed");
    }

    // Clear auth data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return data;
  } catch (error) {
    // Even if the server request fails, clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw error;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_URL}/users/request-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to request password reset");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyResetToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/users/verify-reset/${token}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Invalid or expired reset token");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/users/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to reset password");
    }
    return data;
  } catch (error) {
    throw error;
  }
};
