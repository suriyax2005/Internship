import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

export const fetchPayments = createAsyncThunk('payments/fetchAll', async (tenantProfileId = null, { rejectWithValue }) => {
  try {
    const url = tenantProfileId ? `/payments?tenantProfileId=${tenantProfileId}` : '/payments';
    const response = await api.get(url);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
  }
});

export const createPayment = createAsyncThunk('payments/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/payments', data);
    toast.success('Payment recorded');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to record payment';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const updatePayment = createAsyncThunk('payments/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/payments/${id}`, data);
    toast.success('Payment status updated');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to update payment';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const generateMonthlyRent = createAsyncThunk('payments/generateMonthlyRent', async (_, { rejectWithValue }) => {
  try {
    const response = await api.post('/payments/generate-monthly-rent');
    toast.success(`Generated ${response.data.data.createdCount} monthly rent payments`);
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to generate monthly rent';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default paymentSlice.reducer;
