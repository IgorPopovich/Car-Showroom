import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface FiltersState {
  query: string
  brand: string
  minPrice: string
  maxPrice: string
}

const initialState: FiltersState = {
  query: '',
  brand: 'all',
  minPrice: '',
  maxPrice: '',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
    },
    setBrand(state, action: PayloadAction<string>) {
      state.brand = action.payload
    },
    setMinPrice(state, action: PayloadAction<string>) {
      state.minPrice = action.payload
    },
    setMaxPrice(state, action: PayloadAction<string>) {
      state.maxPrice = action.payload
    },
    resetFilters() {
      return initialState
    },
  },
})

export const { setQuery, setBrand, setMinPrice, setMaxPrice, resetFilters } =
  filtersSlice.actions

export default filtersSlice.reducer
