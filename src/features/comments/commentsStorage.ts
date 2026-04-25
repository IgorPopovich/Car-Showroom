import type { CommentsByVehicleId } from '../../types/comment'

const STORAGE_KEY = 'car_showroom_comments_v1'

export function loadAllComments(): CommentsByVehicleId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object') return {}
    return data as CommentsByVehicleId
  } catch {
    return {}
  }
}

export function saveAllComments(map: CommentsByVehicleId): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore
  }
}
