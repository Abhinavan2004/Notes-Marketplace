import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export type UserRole = 'buyer' | 'seller' | 'both' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  isVerified: boolean
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }) => {
    const res = await api.post<{ accessToken: string; user: AuthUser }>('/auth/login', payload)
    return res.data
  },
)

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (payload: { name: string; email: string; password: string }) => {
    const res = await api.post<{ message: string }>('/auth/signup', payload)
    return res.data
  },
)

export const verifyOtpThunk = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: { email: string; otp: string }) => {
    const res = await api.post<{ message: string }>('/auth/verify-otp', payload)
    return res.data
  },
)

export const fetchMeThunk = createAsyncThunk('auth/me', async () => {
  const res = await api.get<{ user: AuthUser }>('/users/me')
  return res.data.user
})

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  const res = await api.post<{ message: string }>('/auth/logout')
  return res.data
})

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
    },
    logoutLocal(state) {
      state.user = null
      state.accessToken = null
      state.error = null
      state.loading = false
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
      })
  },
})

export const { setAccessToken, logoutLocal } = slice.actions
export default slice.reducer

