import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  darkMode: boolean
}

const initialState: UiState = {
  darkMode: true,
}

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode
    },
  },
})

export const { setDarkMode, toggleDarkMode } = slice.actions
export default slice.reducer

