import { configureStore } from '@reduxjs/toolkit'
import vehiclesReducer from '../../features/vehicles/vehiclesSlice'
import filtersReducer from '../../features/filters/filtersSlice'
import commentsReducer from '../../features/comments/commentsSlice'

export function createTestStore() {
  return configureStore({
    reducer: {
      vehicles: vehiclesReducer,
      filters: filtersReducer,
      comments: commentsReducer,
    },
  })
}

export type TestStore = ReturnType<typeof createTestStore>
