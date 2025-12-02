// Single file containing all slices
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "./api";

// Auth slice
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      const token = response?.token;
      const user = response?.data;
      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      return response.data;
    } catch (error) {
      console.log("error.response :::", error);
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return;
    } catch (error) {
      return rejectWithValue(error?.message || "Logout failed");
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.requestPasswordReset(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to send reset email");
    }
  }
);

export const verifyResetToken = createAsyncThunk(
  "auth/verifyResetToken",
  async (token, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyResetToken(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Invalid or expired token"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword({ token, newPassword });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    resetSuccess: false,
    resetMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearResetSuccess: (state) => {
      state.resetSuccess = false;
      state.resetMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Request Password Reset
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.resetSuccess = false;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resetSuccess = true;
        state.resetMessage = action.payload.message;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.resetSuccess = false;
      })
      // Verify Reset Token
      .addCase(verifyResetToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyResetToken.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyResetToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resetSuccess = true;
        state.resetMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.resetSuccess = false;
      });
  },
});

// Dashboard slice
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearDashboard: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Add dashboard async thunks here later
  },
});

export const { clearError, clearResetSuccess } = authSlice.actions;
export const { clearDashboard } = dashboardSlice.actions;

export default {
  auth: authSlice.reducer,
  dashboard: dashboardSlice.reducer,
};
