import { describe, it, expect } from 'vitest'
import filtersReducer, {
  resetFilters,
  setBrand,
  setMaxPrice,
  setMinPrice,
  setQuery,
} from '../features/filters/filtersSlice'

describe('filtersSlice', () => {
  it('has expected initial state', () => {
    const state = filtersReducer(undefined, { type: '@@INIT' })
    expect(state).toEqual({
      query: '',
      brand: 'all',
      minPrice: '',
      maxPrice: '',
    })
  })

  it('setQuery updates query', () => {
    const next = filtersReducer(undefined, setQuery('  sedan  '))
    expect(next.query).toBe('  sedan  ')
  })

  it('setBrand updates brand', () => {
    const next = filtersReducer(undefined, setBrand('BMW'))
    expect(next.brand).toBe('BMW')
  })

  it('setMinPrice and setMaxPrice update price filters', () => {
    let state = filtersReducer(undefined, setMinPrice('100'))
    state = filtersReducer(state, setMaxPrice('500'))
    expect(state.minPrice).toBe('100')
    expect(state.maxPrice).toBe('500')
  })

  it('resetFilters restores initial state after changes', () => {
    let state = filtersReducer(undefined, setQuery('x'))
    state = filtersReducer(state, setBrand('Audi'))
    state = filtersReducer(state, setMinPrice('1'))
    state = filtersReducer(state, setMaxPrice('9'))
    state = filtersReducer(state, resetFilters())
    expect(state).toEqual({
      query: '',
      brand: 'all',
      minPrice: '',
      maxPrice: '',
    })
  })
})
