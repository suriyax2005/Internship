import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const storedToken = localStorage.getItem('token') || null;

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { user, accessToken } = response.data.data;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', accessToken);
    toast.success('Welcome back!');
    return { user, token: accessToken };
  } catch (error) {
    const msg = error.response?.data?.message || 'Login failed';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    // Clean up any stale sessions before registering a new user
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    const response = await api.post('/auth/register', userData);
    const { user, accessToken } = response.data.data;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', accessToken);
    toast.success('Registration successful!');
    return { user, token: accessToken };
  } catch (error) {
    const msg = error.response?.data?.message || 'Registration failed';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    // Continue cleanup even if server request fails
  }
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  dispatch(clearAuth());
  toast.success('Logged out');
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/profile');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const response = await api.put('/auth/profile', data);
    const updatedUser = response.data.data;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    toast.success('Profile updated successfully');
    return updatedUser;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to update profile';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: storedToken,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearAuth, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
