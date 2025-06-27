import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export const fetchTasks = createAsyncThunk('tasks/fetch', async (query, { rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:5000/api/tasks', { ...authHeader(), params: query });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.error);
  }
});

export const createTask = createAsyncThunk('tasks/create', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('http://localhost:5000/api/tasks', data, authHeader());
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.error);
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, data, authHeader());
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.error);
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, authHeader());
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data.error);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { tasks: [], total: 0, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => { state.tasks = action.payload; state.error = null; })
      .addCase(createTask.fulfilled, (state, action) => { state.tasks.push(action.payload); state.error = null; })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map(t => t._id === action.payload._id ? action.payload : t);
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
        state.error = null;
      })
      .addMatcher(action => action.type.endsWith('rejected'), (state, action) => {
        state.error = action.payload;
      });
  }
});

export default taskSlice.reducer;