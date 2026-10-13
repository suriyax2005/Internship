import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

export const fetchUnits = createAsyncThunk('units/fetchAll', async (propertyId = null, { rejectWithValue }) => {
  try {
    const url = propertyId ? `/units?propertyId=${propertyId}` : '/units';
    const response = await api.get(url);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch units');
  }
});

export const createUnit = createAsyncThunk('units/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/units', data);
    toast.success('Unit created successfully');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to create unit';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const updateUnit = createAsyncThunk('units/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/units/${id}`, data);
    toast.success('Unit updated successfully');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to update unit';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const deleteUnit = createAsyncThunk('units/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/units/${id}`);
    toast.success('Unit deleted');
    return id;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to delete unit';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

const unitSlice = createSlice({
  name: 'units',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u._id !== action.payload);
      });
  },
});

export default unitSlice.reducer;
