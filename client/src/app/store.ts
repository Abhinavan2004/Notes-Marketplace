import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../redux/auth/authSlice'
import notesReducer from '../redux/notes/notesSlice'
import ordersReducer from '../redux/orders/ordersSlice'
import uiReducer from '../redux/ui/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    orders: ordersReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

