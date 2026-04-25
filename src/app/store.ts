import { configureStore } from '@reduxjs/toolkit'
import vehiclesReducer from '../features/vehicles/vehiclesSlice'
import filtersReducer from '../features/filters/filtersSlice'
import commentsReducer from '../features/comments/commentsSlice'

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    filters: filtersReducer,
    comments: commentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
