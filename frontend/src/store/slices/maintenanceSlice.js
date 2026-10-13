import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

export const fetchTickets = createAsyncThunk('maintenance/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/maintenance');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
  }
});

export const createTicket = createAsyncThunk('maintenance/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/maintenance', data);
    toast.success('Maintenance ticket submitted');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to submit ticket';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const updateTicket = createAsyncThunk('maintenance/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/maintenance/${id}`, data);
    toast.success('Ticket updated');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to update ticket';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const deleteTicket = createAsyncThunk('maintenance/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/maintenance/${id}`);
    toast.success('Ticket deleted');
    return id;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to delete ticket';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      });
  },
});

export default maintenanceSlice.reducer;
