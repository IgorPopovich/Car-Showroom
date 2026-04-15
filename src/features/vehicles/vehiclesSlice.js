import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import {
  fetchVehicleByIdFromDummyJson,
  fetchVehiclesFromDummyJson,
} from '../../api/dummyjson'

const vehiclesAdapter = createEntityAdapter({
  selectId: (v) => v.id,
  sortComparer: (a, b) => (a.title || '').localeCompare(b.title || ''),
})

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (_, { signal }) => {
    const data = await fetchVehiclesFromDummyJson({ signal })
    return data.products ?? []
  },
  {
    condition: (_, { getState }) => {
      const { vehicles } = getState()
      if (vehicles.status === 'loading' || vehicles.status === 'succeeded') return false
      return true
    },
  },
)

export const fetchVehicleById = createAsyncThunk(
  'vehicles/fetchVehicleById',
  async (id, { signal }) => {
    const data = await fetchVehicleByIdFromDummyJson(id, { signal })
    return data
  },
  {
    condition: (id, { getState }) => {
      const state = getState()
      const numericId = Number(id)
      const exists = vehiclesAdapter.getSelectors().selectById(state.vehicles, numericId)
      if (exists) return false
      if (state.vehicles.loadingById[String(numericId)]) return false
      return true
    },
  },
)

const initialState = vehiclesAdapter.getInitialState({
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  loadingById: {},
})

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded'
        vehiclesAdapter.setAll(state, action.payload)
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error?.message ?? 'Unknown error'
      })
      .addCase(fetchVehicleById.pending, (state, action) => {
        state.loadingById[String(action.meta.arg)] = true
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        delete state.loadingById[String(action.meta.arg)]
        vehiclesAdapter.upsertOne(state, action.payload)
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        delete state.loadingById[String(action.meta.arg)]
      })
  },
})

export default vehiclesSlice.reducer

export const vehiclesSelectors = vehiclesAdapter.getSelectors((state) => state.vehicles)

