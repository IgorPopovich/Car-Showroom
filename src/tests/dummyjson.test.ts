import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  fetchVehicleByIdFromDummyJson,
  fetchVehiclesFromDummyJson,
} from '../api/dummyjson'

describe('dummyjson API helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetchVehiclesFromDummyJson throws when response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
      }),
    )
    await expect(fetchVehiclesFromDummyJson()).rejects.toThrow('Request failed: 502')
  })

  it('fetchVehiclesFromDummyJson returns parsed JSON on success', async () => {
    const body = { products: [{ id: 1, title: 'T', description: 'd', price: 1, thumbnail: 'x' }] }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(body),
      }),
    )
    await expect(fetchVehiclesFromDummyJson()).resolves.toEqual(body)
  })

  it('fetchVehicleByIdFromDummyJson throws when response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    )
    await expect(fetchVehicleByIdFromDummyJson(99)).rejects.toThrow('Request failed: 404')
  })

  it('fetchVehicleByIdFromDummyJson passes id and AbortSignal to fetch', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 5, title: 'X', description: '', price: 0, thumbnail: '' }),
    })
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()
    await fetchVehicleByIdFromDummyJson(5, { signal: controller.signal })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/products/5',
      expect.objectContaining({ signal: controller.signal }),
    )
  })
})
