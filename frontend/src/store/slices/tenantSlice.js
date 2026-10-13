import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

export const fetchTenants = createAsyncThunk('tenants/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/tenants');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenants');
  }
});

export const createTenant = createAsyncThunk('tenants/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/tenants', data);
    toast.success('Tenant profile created successfully');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to create tenant';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const updateTenant = createAsyncThunk('tenants/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/tenants/${id}`, data);
    toast.success('Tenant profile updated');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to update tenant';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const deleteTenant = createAsyncThunk('tenants/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tenants/${id}`);
    toast.success('Tenant profile deleted');
    return id;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to delete tenant';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

const tenantSlice = createSlice({
  name: 'tenants',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      });
  },
});

export default tenantSlice.reducer;
