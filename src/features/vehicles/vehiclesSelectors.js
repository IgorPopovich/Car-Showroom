import { createSelector } from '@reduxjs/toolkit'
import { vehiclesSelectors } from './vehiclesSlice'

const selectFilters = (state) => state.filters

export const selectAllVehicles = vehiclesSelectors.selectAll

export const selectVehicleById = (state, id) =>
  vehiclesSelectors.selectById(state, Number(id))

export const selectBrands = createSelector([selectAllVehicles], (vehicles) => {
  const set = new Set()
  for (const v of vehicles) {
    if (v.brand) set.add(v.brand)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

export const selectFilteredVehicles = createSelector(
  [selectAllVehicles, selectFilters],
  (vehicles, filters) => {
    const q = filters.query.trim().toLowerCase()
    const brand = filters.brand
    const minP = filters.minPrice === '' ? null : Number(filters.minPrice)
    const maxP = filters.maxPrice === '' ? null : Number(filters.maxPrice)

    return vehicles.filter((v) => {
      if (brand !== 'all' && v.brand !== brand) return false
      if (minP != null && Number(v.price) < minP) return false
      if (maxP != null && Number(v.price) > maxP) return false
      if (!q) return true

      const hay = `${v.title ?? ''} ${v.brand ?? ''} ${v.description ?? ''}`.toLowerCase()
      return hay.includes(q)
    })
  },
)

