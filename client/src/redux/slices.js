// Single file containing all slices
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  assignmentsAPI,
  authAPI,
  batchesAPI,
  facultyAPI,
  studentsAPI,
} from "./api";

// Read persisted auth state from localStorage so route protection works after reload
const _storedUser = (() => {
  try {
    const v = localStorage.getItem("user");
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
})();
const _hasToken = !!localStorage.getItem("token");

// Auth slice
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      const token = response?.token;
      const user = response?.data;
      if (token) {
        localStorage.setItem("token", token);
        window.token = token;
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        window.user = user;
      }
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
      delete window.token;
      delete window.user;
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

// Get user by type
export const getUserByType = createAsyncThunk(
  "auth/getUserByType",
  async (userType, { rejectWithValue }) => {
    try {
      const response = await authAPI.getUserByType(userType);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch users by type");
    }
  }
);

// Assignments thunks
export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await assignmentsAPI.getAll({ page, limit });
      // response expected shape: { data: [...], meta: { total, page, limit, totalPages } }
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch assignments");
    }
  }
);

export const fetchAssignment = createAsyncThunk(
  "assignments/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await assignmentsAPI.getOne(id);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch assignment");
    }
  }
);

export const createAssignment = createAsyncThunk(
  "assignments/create",
  async (assignmentData, { rejectWithValue }) => {
    try {
      const data = await assignmentsAPI.create(assignmentData);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create assignment");
    }
  }
);

export const updateAssignment = createAsyncThunk(
  "assignments/update",
  async ({ id, assignmentData }, { rejectWithValue }) => {
    try {
      const data = await assignmentsAPI.update(id, assignmentData);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update assignment");
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  "assignments/delete",
  async (id, { rejectWithValue }) => {
    try {
      const data = await assignmentsAPI.delete(id);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to delete assignment");
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

// Batches thunks
export const fetchBatches = createAsyncThunk(
  "batches/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await batchesAPI.getAll({ page, limit });
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch batches");
    }
  }
);

export const fetchBatch = createAsyncThunk(
  "batches/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await batchesAPI.getOne(id);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch batch");
    }
  }
);

export const createBatch = createAsyncThunk(
  "batches/create",
  async (batchData, { rejectWithValue }) => {
    try {
      const data = await batchesAPI.create(batchData);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create batch");
    }
  }
);

export const updateBatch = createAsyncThunk(
  "batches/update",
  async ({ id, batchData }, { rejectWithValue }) => {
    try {
      const data = await batchesAPI.update(id, batchData);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update batch");
    }
  }
);

export const deleteBatch = createAsyncThunk(
  "batches/delete",
  async (id, { rejectWithValue }) => {
    try {
      const data = await batchesAPI.delete(id);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to delete batch");
    }
  }
);

// Students thunks
export const fetchStudents = createAsyncThunk(
  "students/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await studentsAPI.getAll({ page, limit });
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch students");
    }
  }
);

export const fetchStudent = createAsyncThunk(
  "students/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await studentsAPI.getOne(id);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch student");
    }
  }
);

export const createStudent = createAsyncThunk(
  "students/create",
  async (studentData, { rejectWithValue }) => {
    try {
      const data = await studentsAPI.create(studentData);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create student");
    }
  }
);

export const updateStudent = createAsyncThunk(
  "students/update",
  async ({ id, studentData }, { rejectWithValue }) => {
    try {
      const data = await studentsAPI.update(id, studentData);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update student");
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "students/delete",
  async (id, { rejectWithValue }) => {
    try {
      const data = await studentsAPI.delete(id);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to delete student");
    }
  }
);

// Faculty thunks
export const fetchFaculty = createAsyncThunk(
  "faculty/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await facultyAPI.getAll({ page, limit });
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch faculty");
    }
  }
);

export const fetchFacultyById = createAsyncThunk(
  "faculty/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await facultyAPI.getOne(id);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch faculty");
    }
  }
);

export const createFaculty = createAsyncThunk(
  "faculty/create",
  async (facultyData, { rejectWithValue }) => {
    try {
      const data = await facultyAPI.create(facultyData);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create faculty");
    }
  }
);

export const updateFaculty = createAsyncThunk(
  "faculty/update",
  async ({ id, facultyData }, { rejectWithValue }) => {
    try {
      const data = await facultyAPI.update(id, facultyData);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update faculty");
    }
  }
);

export const deleteFaculty = createAsyncThunk(
  "faculty/delete",
  async (id, { rejectWithValue }) => {
    try {
      const data = await facultyAPI.delete(id);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to delete faculty");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: _storedUser,
    isAuthenticated: _hasToken,
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
        state.user = action.payload;
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

// Assignments slice
const assignmentsSlice = createSlice({
  name: "assignments",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
    createSuccess: false,
    createMessage: null,
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  },
  reducers: {
    clearAssignments: (state) => {
      state.list = [];
      state.error = null;
      state.createSuccess = false;
      state.createMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        // action.payload = { data: [...], meta: {...} }
        state.list = action.payload?.data || [];
        state.meta = action.payload?.meta || state.meta;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssignment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createAssignment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createSuccess = true;
        // prepend the newly created assignment
        if (action.payload) state.list.unshift(action.payload);
        state.createMessage = action.payload?.message || null;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      .addCase(updateAssignment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the assignment in the list
        const index = state.list.findIndex((a) => a.id === action.payload?.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteAssignment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted assignment from the list
        state.list = state.list.filter((a) => a.id !== action.meta.arg);
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearResetSuccess } = authSlice.actions;
export const { clearDashboard } = dashboardSlice.actions;
export const { clearAssignments } = assignmentsSlice.actions;

// Batches slice
const batchesSlice = createSlice({
  name: "batches",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
    createSuccess: false,
    createMessage: null,
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  },
  reducers: {
    clearBatches: (state) => {
      state.list = [];
      state.error = null;
      state.createSuccess = false;
      state.createMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload?.data || [];
        state.meta = action.payload?.meta || state.meta;
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchBatch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBatch.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchBatch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createBatch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createBatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createSuccess = true;
        if (action.payload) state.list.unshift(action.payload);
        state.createMessage = action.payload?.message || null;
      })
      .addCase(createBatch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      .addCase(updateBatch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBatch.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.list.findIndex((b) => b.id === action.payload?.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateBatch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBatch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.filter((b) => b.id !== action.meta.arg);
      })
      .addCase(deleteBatch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBatches } = batchesSlice.actions;

// Students slice
const studentsSlice = createSlice({
  name: "students",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
    createSuccess: false,
    createMessage: null,
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  },
  reducers: {
    clearStudents: (state) => {
      state.list = [];
      state.error = null;
      state.createSuccess = false;
      state.createMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload?.data || [];
        state.meta = action.payload?.meta || state.meta;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createSuccess = true;
        if (action.payload) state.list.unshift(action.payload);
        state.createMessage = action.payload?.message || null;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      .addCase(updateStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.list.findIndex((s) => s.id === action.payload?.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.filter((s) => s.id !== action.meta.arg);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStudents } = studentsSlice.actions;

// Faculty slice
const facultySlice = createSlice({
  name: "faculty",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
    createSuccess: false,
    createMessage: null,
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  },
  reducers: {
    clearFaculty: (state) => {
      state.list = [];
      state.error = null;
      state.createSuccess = false;
      state.createMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaculty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFaculty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload?.data || [];
        state.meta = action.payload?.meta || state.meta;
      })
      .addCase(fetchFaculty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFacultyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFacultyById.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchFacultyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createFaculty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createFaculty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createSuccess = true;
        if (action.payload) state.list.unshift(action.payload);
        state.createMessage = action.payload?.message || null;
      })
      .addCase(createFaculty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      .addCase(updateFaculty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFaculty.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.list.findIndex((f) => f.id === action.payload?.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateFaculty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteFaculty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFaculty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.filter((f) => f.id !== action.meta.arg);
      })
      .addCase(deleteFaculty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFaculty } = facultySlice.actions;

export default {
  auth: authSlice.reducer,
  dashboard: dashboardSlice.reducer,
  assignments: assignmentsSlice.reducer,
  batches: batchesSlice.reducer,
  students: studentsSlice.reducer,
  faculty: facultySlice.reducer,
};
