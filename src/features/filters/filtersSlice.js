import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  query: '',
  brand: 'all',
  minPrice: '',
  maxPrice: '',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload
    },
    setBrand(state, action) {
      state.brand = action.payload
    },
    setMinPrice(state, action) {
      state.minPrice = action.payload
    },
    setMaxPrice(state, action) {
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

