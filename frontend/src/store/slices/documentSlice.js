import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

export const fetchDocuments = createAsyncThunk('documents/fetchAll', async (documentType = null, { rejectWithValue }) => {
  try {
    const url = documentType ? `/documents?documentType=${documentType}` : '/documents';
    const response = await api.get(url);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents');
  }
});

export const uploadDocument = createAsyncThunk('documents/upload', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Document uploaded successfully');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to upload document';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const updateDocument = createAsyncThunk('documents/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/documents/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Document updated successfully');
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to update document';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const deleteDocument = createAsyncThunk('documents/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/documents/${id}`);
    toast.success('Document deleted');
    return id;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to delete document';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

const documentSlice = createSlice({
  name: 'documents',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.list = state.list.map((d) => (d._id === action.payload._id ? action.payload : d));
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d._id !== action.payload);
      });
  },
});

export default documentSlice.reducer;
