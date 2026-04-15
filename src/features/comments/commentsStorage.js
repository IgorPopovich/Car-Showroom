const STORAGE_KEY = 'car_showroom_comments_v1'

export function loadAllComments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return {}
    return data
  } catch {
    return {}
  }
}

export function saveAllComments(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore
  }
}

