import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

export const fetchLeases = createAsyncThunk('leases/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/leases');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch leases');
  }
});

export const createLease = createAsyncThunk('leases/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/leases', data);
    toast.success('Lease contract created');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to create lease';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const updateLease = createAsyncThunk('leases/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/leases/${id}`, data);
    toast.success('Lease updated');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to update lease';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const deleteLease = createAsyncThunk('leases/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/leases/${id}`);
    toast.success('Lease deleted');
    return id;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to delete lease';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

const leaseSlice = createSlice({
  name: 'leases',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeases.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchLeases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createLease.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateLease.fulfilled, (state, action) => {
        const index = state.list.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteLease.fulfilled, (state, action) => {
        state.list = state.list.filter((l) => l._id !== action.payload);
      });
  },
});

export default leaseSlice.reducer;
