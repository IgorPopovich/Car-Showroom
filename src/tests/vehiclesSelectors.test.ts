import { describe, it, expect } from 'vitest'
import { fetchVehicles } from '../features/vehicles/vehiclesSlice'
import {
  resetFilters,
  setBrand,
  setMaxPrice,
  setMinPrice,
  setQuery,
} from '../features/filters/filtersSlice'
import {
  selectBrands,
  selectFilteredVehicles,
  selectVehicleById,
} from '../features/vehicles/vehiclesSelectors'
import { createTestStore } from './helpers/testStore'
import { vehicleAlpha, vehicleBeta, vehicleNoBrand } from './fixtures/vehicles'

describe('selectVehicleById', () => {
  it('returns undefined when id is undefined', () => {
    const store = createTestStore()
    expect(selectVehicleById(store.getState(), undefined)).toBeUndefined()
  })

  it('returns vehicle when present', () => {
    const store = createTestStore()
    store.dispatch(fetchVehicles.fulfilled([vehicleAlpha], 'r1', undefined))
    expect(selectVehicleById(store.getState(), '10')).toEqual(vehicleAlpha)
    expect(selectVehicleById(store.getState(), '99')).toBeUndefined()
  })
})

describe('selectBrands', () => {
  it('collects unique brands and sorts alphabetically', () => {
    const store = createTestStore()
    store.dispatch(
      fetchVehicles.fulfilled([vehicleAlpha, vehicleBeta, vehicleNoBrand], 'r1', undefined),
    )
    expect(selectBrands(store.getState())).toEqual(['Audi', 'BMW'])
  })
})

describe('selectFilteredVehicles', () => {
  it('returns all vehicles when filters are default', () => {
    const store = createTestStore()
    store.dispatch(fetchVehicles.fulfilled([vehicleAlpha, vehicleBeta], 'r1', undefined))
    expect(selectFilteredVehicles(store.getState())).toHaveLength(2)
  })

  it('filters by brand', () => {
    const store = createTestStore()
    store.dispatch(fetchVehicles.fulfilled([vehicleAlpha, vehicleBeta], 'r1', undefined))
    store.dispatch(setBrand('BMW'))
    expect(selectFilteredVehicles(store.getState()).map((v) => v.id)).toEqual([10])
  })

  it('filters by min and max price (inclusive bounds)', () => {
    const store = createTestStore()
    store.dispatch(fetchVehicles.fulfilled([vehicleAlpha, vehicleBeta], 'r1', undefined))
    store.dispatch(setMinPrice('30000'))
    store.dispatch(setMaxPrice('50000'))
    expect(selectFilteredVehicles(store.getState()).map((v) => v.id)).toEqual([20])
  })

  it('filters by query across title, brand, description (case-insensitive)', () => {
    const store = createTestStore()
    store.dispatch(fetchVehicles.fulfilled([vehicleAlpha, vehicleBeta], 'r1', undefined))
    store.dispatch(setQuery('OFF-ROAD'))
    expect(selectFilteredVehicles(store.getState()).map((v) => v.id)).toEqual([20])
  })

  it('combines brand, price, and query filters', () => {
    const store = createTestStore()
    store.dispatch(fetchVehicles.fulfilled([vehicleAlpha, vehicleBeta], 'r1', undefined))
    store.dispatch(setBrand('BMW'))
    store.dispatch(setMinPrice('20000'))
    store.dispatch(setMaxPrice('30000'))
    store.dispatch(setQuery('alpha'))
    expect(selectFilteredVehicles(store.getState()).map((v) => v.id)).toEqual([10])
  })

  it('returns empty when nothing matches', () => {
    const store = createTestStore()
    store.dispatch(fetchVehicles.fulfilled([vehicleAlpha], 'r1', undefined))
    store.dispatch(setBrand('Audi'))
    expect(selectFilteredVehicles(store.getState())).toEqual([])
  })

  it('resetFilters clears filters so all vehicles match again', () => {
    const store = createTestStore()
    store.dispatch(fetchVehicles.fulfilled([vehicleAlpha, vehicleBeta], 'r1', undefined))
    store.dispatch(setBrand('BMW'))
    store.dispatch(setQuery('nomatch'))
    expect(selectFilteredVehicles(store.getState())).toEqual([])
    store.dispatch(resetFilters())
    expect(selectFilteredVehicles(store.getState())).toHaveLength(2)
  })
})
