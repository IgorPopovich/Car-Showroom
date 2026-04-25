import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Comment, CommentsByVehicleId } from '../../types/comment'
import { loadAllComments, saveAllComments } from './commentsStorage'

const EMPTY: Comment[] = []

export interface CommentsState {
  byVehicleId: CommentsByVehicleId
}

const initialState: CommentsState = {
  byVehicleId: loadAllComments(),
}

export interface AddCommentPayload {
  vehicleId: string
  text: string
  author: string
}

export interface DeleteCommentPayload {
  vehicleId: string
  commentId: string
}

interface AddCommentPrepared {
  vehicleId: string
  comment: Comment
}

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: {
      reducer(state, action: PayloadAction<AddCommentPrepared>) {
        const { vehicleId, comment } = action.payload
        const key = String(vehicleId)
        if (!state.byVehicleId[key]) state.byVehicleId[key] = []
        state.byVehicleId[key].unshift(comment)
        saveAllComments(state.byVehicleId)
      },
      prepare({ vehicleId, text, author }: AddCommentPayload) {
        const comment: Comment = {
          id: nanoid(),
          text,
          author,
          createdAt: Date.now(),
        }
        return {
          payload: {
            vehicleId,
            comment,
          },
        }
      },
    },
    deleteComment(state, action: PayloadAction<DeleteCommentPayload>) {
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

export function selectCommentsForVehicle(
  state: RootState,
  vehicleId: string | undefined,
): Comment[] {
  if (vehicleId === undefined) return EMPTY
  return state.comments.byVehicleId[String(vehicleId)] ?? EMPTY
}
