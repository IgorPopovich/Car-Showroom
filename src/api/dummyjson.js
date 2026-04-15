const API_BASE = 'https://dummyjson.com'

export async function fetchVehiclesFromDummyJson({ signal } = {}) {
  const url = `${API_BASE}/products/category/vehicle?limit=100`
  const res = await fetch(url, { signal })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json()
}

export async function fetchVehicleByIdFromDummyJson(id, { signal } = {}) {
  const res = await fetch(`${API_BASE}/products/${id}`, { signal })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json()
}

