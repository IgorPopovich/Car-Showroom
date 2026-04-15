import { createSlice, nanoid } from '@reduxjs/toolkit'
import { loadAllComments, saveAllComments } from './commentsStorage'

const EMPTY = []

const initialState = {
  byVehicleId: loadAllComments(),
}

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: {
      reducer(state, action) {
        const { vehicleId, comment } = action.payload
        const key = String(vehicleId)
        if (!state.byVehicleId[key]) state.byVehicleId[key] = []
        state.byVehicleId[key].unshift(comment)
        saveAllComments(state.byVehicleId)
      },
      prepare({ vehicleId, text, author }) {
        return {
          payload: {
            vehicleId,
            comment: {
              id: nanoid(),
              text,
              author,
              createdAt: Date.now(),
            },
          },
        }
      },
    },
    deleteComment(state, action) {
      const { vehicleId, commentId } = action.payload
      const key = String(vehicleId)
      const arr = state.byVehicleId[key] ?? []
      state.byVehicleId[key] = arr.filter((c) => c.id !== commentId)
      saveAllComments(state.byVehicleId)
    },
  },
})

export const { addComment, deleteComment } = commentsSlice.actions
export default commentsSlice.reducer

export const selectCommentsForVehicle = (state, vehicleId) =>
  state.comments.byVehicleId[String(vehicleId)] ?? EMPTY

