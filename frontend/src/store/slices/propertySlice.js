import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

export const fetchProperties = createAsyncThunk('properties/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/properties');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
  }
});

export const fetchPropertyById = createAsyncThunk('properties/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch property details');
  }
});

export const createProperty = createAsyncThunk('properties/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/properties', data);
    toast.success('Property created successfully');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to create property';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const updateProperty = createAsyncThunk('properties/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/properties/${id}`, data);
    toast.success('Property updated successfully');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to update property';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const deleteProperty = createAsyncThunk('properties/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/properties/${id}`);
    toast.success('Property deleted');
    return id;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to delete property';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

const propertySlice = createSlice({
  name: 'properties',
  initialState: {
    list: [],
    selectedProperty: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedProperty: (state) => {
      state.selectedProperty = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.selectedProperty = action.payload;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.selectedProperty?._id === action.payload._id) {
          state.selectedProperty = action.payload;
        }
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearSelectedProperty } = propertySlice.actions;
export default propertySlice.reducer;
