import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type EntityState,
} from '@reduxjs/toolkit'
import type { Vehicle } from '../../types/vehicle'
import {
  fetchVehicleByIdFromDummyJson,
  fetchVehiclesFromDummyJson,
} from '../../api/dummyjson'
import type { RootState } from '../../app/store'

export type VehiclesStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type VehiclesState = EntityState<Vehicle, number> & {
  status: VehiclesStatus
  error: string | null
  loadingById: Record<string, boolean>
}

const vehiclesAdapter = createEntityAdapter<Vehicle, number>({
  selectId: (v: Vehicle) => v.id,
  sortComparer: (a, b) => (a.title || '').localeCompare(b.title || ''),
})

const initialState: VehiclesState = vehiclesAdapter.getInitialState({
  status: 'idle',
  error: null,
  loadingById: {},
})

export const fetchVehicles = createAsyncThunk<Vehicle[], void, { state: RootState }>(
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

export const fetchVehicleById = createAsyncThunk<Vehicle, string, { state: RootState }>(
  'vehicles/fetchVehicleById',
  async (id, { signal }) => fetchVehicleByIdFromDummyJson(id, { signal }),
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
        state.error = action.error.message ?? 'Unknown error'
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

export const vehiclesSelectors = vehiclesAdapter.getSelectors((state: RootState) => state.vehicles)
