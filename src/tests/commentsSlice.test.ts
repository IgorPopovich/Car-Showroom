import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import * as commentsStorage from '../features/comments/commentsStorage'
import commentsReducer, {
  addComment,
  deleteComment,
  selectCommentsForVehicle,
} from '../features/comments/commentsSlice'
import vehiclesReducer from '../features/vehicles/vehiclesSlice'
import filtersReducer from '../features/filters/filtersSlice'
vi.mock('../features/comments/commentsStorage', () => ({
  loadAllComments: vi.fn(() => ({})),
  saveAllComments: vi.fn(),
}))

const loadMock = vi.mocked(commentsStorage.loadAllComments)
const saveMock = vi.mocked(commentsStorage.saveAllComments)

function createCommentsStore() {
  return configureStore({
    reducer: {
      vehicles: vehiclesReducer,
      filters: filtersReducer,
      comments: commentsReducer,
    },
  })
}

describe('commentsSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    loadMock.mockReturnValue({})
  })

  it('addComment prepends comment and persists', () => {
    const store = createCommentsStore()
    store.dispatch(
      addComment({ vehicleId: '1', author: 'Ann', text: 'Nice car' }),
    )
    const list = store.getState().comments.byVehicleId['1']
    expect(list).toHaveLength(1)
    expect(list![0].author).toBe('Ann')
    expect(list![0].text).toBe('Nice car')
    expect(list![0].id).toBeTruthy()
    expect(typeof list![0].createdAt).toBe('number')
    expect(saveMock).toHaveBeenCalled()
  })

  it('addComment for same vehicle keeps newest first', () => {
    const store = createCommentsStore()
    store.dispatch(addComment({ vehicleId: '1', author: 'A', text: 'first' }))
    store.dispatch(addComment({ vehicleId: '1', author: 'B', text: 'second' }))
    const texts = store.getState().comments.byVehicleId['1']!.map((c) => c.text)
    expect(texts).toEqual(['second', 'first'])
  })

  it('deleteComment removes by id and persists', () => {
    const store = createCommentsStore()
    store.dispatch(addComment({ vehicleId: '1', author: 'A', text: 'x' }))
    const id = store.getState().comments.byVehicleId['1']![0].id
    store.dispatch(deleteComment({ vehicleId: '1', commentId: id }))
    expect(store.getState().comments.byVehicleId['1']).toEqual([])
    expect(saveMock).toHaveBeenCalled()
  })

  it('deleteComment on missing vehicle key uses empty array', () => {
    const store = createCommentsStore()
    store.dispatch(deleteComment({ vehicleId: '99', commentId: 'any' }))
    expect(store.getState().comments.byVehicleId['99']).toEqual([])
  })
})

describe('selectCommentsForVehicle', () => {
  it('returns empty array when vehicleId is undefined', () => {
    const store = createCommentsStore()
    expect(selectCommentsForVehicle(store.getState(), undefined)).toEqual([])
  })

  it('returns empty array when no comments for vehicle', () => {
    const store = createCommentsStore()
    expect(selectCommentsForVehicle(store.getState(), '1')).toEqual([])
  })

  it('returns comments for vehicle', () => {
    const store = createCommentsStore()
    store.dispatch(addComment({ vehicleId: '5', author: 'Z', text: 'hello' }))
    expect(selectCommentsForVehicle(store.getState(), '5')).toHaveLength(1)
  })
})
