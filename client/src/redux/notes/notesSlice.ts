import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export interface NoteCard {
  _id: string
  title: string
  subject: string
  description: string
  price: number
  averageRating: number
  totalSales: number
  previewUrl?: string
  seller?: { name: string }
}

interface NotesState {
  items: NoteCard[]
  loading: boolean
  error: string | null
}

const initialState: NotesState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchNotesThunk = createAsyncThunk('notes/list', async () => {
  const res = await api.get<{ items: NoteCard[] }>('/notes')
  return res.data.items
})

const slice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchNotesThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotesThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchNotesThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load notes'
      })
  },
})

export default slice.reducer

