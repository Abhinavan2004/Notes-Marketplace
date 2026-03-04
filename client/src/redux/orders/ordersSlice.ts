import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export interface OrderItem {
  _id: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  amount: number
  purchasedAt?: string
  note?: { _id: string; title: string; subject: string; price: number }
}

interface OrdersState {
  orders: OrderItem[]
  loading: boolean
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
}

export const fetchMyOrdersThunk = createAsyncThunk('orders/my', async () => {
  const res = await api.get<{ orders: OrderItem[] }>('/orders')
  return res.data.orders
})

const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMyOrdersThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchMyOrdersThunk.rejected, (state) => {
        state.loading = false
      })
  },
})

export default slice.reducer

