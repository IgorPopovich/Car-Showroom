import type { DummyJsonProductsListResponse, Vehicle } from '../types/vehicle'

const API_BASE = 'https://dummyjson.com'

export async function fetchVehiclesFromDummyJson({
  signal,
}: { signal?: AbortSignal } = {}): Promise<DummyJsonProductsListResponse> {
  const url = `${API_BASE}/products/category/vehicle?limit=100`
  const res = await fetch(url, { signal })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json() as Promise<DummyJsonProductsListResponse>
}

export async function fetchVehicleByIdFromDummyJson(
  id: string | number,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Vehicle> {
  const res = await fetch(`${API_BASE}/products/${id}`, { signal })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json() as Promise<Vehicle>
}
