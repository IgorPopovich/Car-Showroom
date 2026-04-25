import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as dummyjson from '../api/dummyjson'
import vehiclesReducer, { fetchVehicleById, fetchVehicles } from '../features/vehicles/vehiclesSlice'
import { createTestStore } from './helpers/testStore'
import { vehicleAlpha, vehicleBeta } from './fixtures/vehicles'

vi.mock('../api/dummyjson', () => ({
  fetchVehiclesFromDummyJson: vi.fn(),
  fetchVehicleByIdFromDummyJson: vi.fn(),
}))

const mockedList = vi.mocked(dummyjson.fetchVehiclesFromDummyJson)
const mockedById = vi.mocked(dummyjson.fetchVehicleByIdFromDummyJson)

describe('vehiclesSlice reducer', () => {
  it('pending sets status loading and clears error', () => {
    const failed = vehiclesReducer(undefined, fetchVehicles.rejected(new Error('x'), 'r1', undefined))
    const next = vehiclesReducer(failed, fetchVehicles.pending('r2', undefined))
    expect(next.status).toBe('loading')
    expect(next.error).toBe(null)
  })

  it('fulfilled sets succeeded and replaces entities', () => {
    const pending = vehiclesReducer(undefined, fetchVehicles.pending('r1', undefined))
    const next = vehiclesReducer(
      pending,
      fetchVehicles.fulfilled([vehicleAlpha, vehicleBeta], 'r1', undefined),
    )
    expect(next.status).toBe('succeeded')
    expect(next.ids).toHaveLength(2)
    expect(next.entities[10]?.title).toBe('Alpha Sedan')
  })

  it('rejected sets failed and error message', () => {
    const pending = vehiclesReducer(undefined, fetchVehicles.pending('r1', undefined))
    const next = vehiclesReducer(
      pending,
      fetchVehicles.rejected(new Error('Network down'), 'r1', undefined),
    )
    expect(next.status).toBe('failed')
    expect(next.error).toBe('Network down')
  })

  it('fetchVehicleById pending toggles loadingById', () => {
    const next = vehiclesReducer(
      undefined,
      fetchVehicleById.pending('r1', '10'),
    )
    expect(next.loadingById['10']).toBe(true)
  })

  it('fetchVehicleById fulfilled upserts and clears loadingById', () => {
    let state = vehiclesReducer(undefined, fetchVehicleById.pending('r1', '10'))
    state = vehiclesReducer(
      state,
      fetchVehicleById.fulfilled(vehicleAlpha, 'r1', '10'),
    )
    expect(state.loadingById['10']).toBeUndefined()
    expect(state.entities[10]?.title).toBe('Alpha Sedan')
  })

  it('fetchVehicleById rejected clears loadingById', () => {
    let state = vehiclesReducer(undefined, fetchVehicleById.pending('r1', '10'))
    state = vehiclesReducer(
      state,
      fetchVehicleById.rejected(new Error('fail'), 'r1', '10'),
    )
    expect(state.loadingById['10']).toBeUndefined()
  })
})

describe('vehicles thunks (integration with store)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchVehicles loads products from API', async () => {
    mockedList.mockResolvedValue({ products: [vehicleAlpha] })
    const store = createTestStore()
    await store.dispatch(fetchVehicles())
    expect(mockedList).toHaveBeenCalledTimes(1)
    expect(store.getState().vehicles.status).toBe('succeeded')
    expect(store.getState().vehicles.entities[10]).toEqual(vehicleAlpha)
  })

  it('fetchVehicles does not call API again when already succeeded', async () => {
    mockedList.mockResolvedValue({ products: [vehicleAlpha] })
    const store = createTestStore()
    await store.dispatch(fetchVehicles())
    await store.dispatch(fetchVehicles())
    expect(mockedList).toHaveBeenCalledTimes(1)
  })

  it('fetchVehicles does not call API when already loading', async () => {
    let resolveList!: (v: { products: typeof vehicleAlpha[] }) => void
    const listPromise = new Promise<{ products: typeof vehicleAlpha[] }>((r) => {
      resolveList = r
    })
    mockedList.mockReturnValue(listPromise)
    const store = createTestStore()
    const first = store.dispatch(fetchVehicles())
    const second = store.dispatch(fetchVehicles())
    resolveList({ products: [vehicleAlpha] })
    await Promise.all([first, second])
    expect(mockedList).toHaveBeenCalledTimes(1)
  })

  it('fetchVehicleById loads single vehicle', async () => {
    mockedById.mockResolvedValue(vehicleBeta)
    const store = createTestStore()
    await store.dispatch(fetchVehicleById('20'))
    expect(mockedById).toHaveBeenCalledWith('20', expect.objectContaining({ signal: expect.any(AbortSignal) }))
    expect(store.getState().vehicles.entities[20]).toEqual(vehicleBeta)
  })

  it('fetchVehicleById is skipped when vehicle already in store', async () => {
    mockedList.mockResolvedValue({ products: [vehicleAlpha] })
    const store = createTestStore()
    await store.dispatch(fetchVehicles())
    await store.dispatch(fetchVehicleById('10'))
    expect(mockedById).not.toHaveBeenCalled()
  })

  it('fetchVehicleById is skipped while same id is loading', async () => {
    let resolveById!: (v: typeof vehicleAlpha) => void
    const byIdPromise = new Promise<typeof vehicleAlpha>((r) => {
      resolveById = r
    })
    mockedById.mockReturnValue(byIdPromise)
    const store = createTestStore()
    const a = store.dispatch(fetchVehicleById('10'))
    const b = store.dispatch(fetchVehicleById('10'))
    resolveById(vehicleAlpha)
    await Promise.all([a, b])
    expect(mockedById).toHaveBeenCalledTimes(1)
  })
})
