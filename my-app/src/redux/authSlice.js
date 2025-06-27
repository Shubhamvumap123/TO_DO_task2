import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const token = localStorage.getItem('token');

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', data);
    localStorage.setItem('token', res.data.token);
    return res.data.token;
  } catch (err) {
    return rejectWithValue(err.response.data.error);
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', data);
    localStorage.setItem('token', res.data.token);
    return res.data.token;
  } catch (err) {
    return rejectWithValue(err.response.data.error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: token || null, error: null },
  reducers: {
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => { state.token = action.payload; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.token = action.payload; state.error = null; })
      .addCase(register.rejected, (state, action) => { state.error = action.payload; })
      .addCase(login.rejected, (state, action) => { state.error = action.payload; });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;