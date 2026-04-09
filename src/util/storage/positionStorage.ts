import {
  FIVE_MINUTES_MS,
  POSITION_STORAGE_KEY,
  REQUEST_TIME_KEY,
} from '@/data/constant'
import type { StoredPosition } from '@/types/routeType'

export function shouldUpdatePositionStorage(
  currentPosition: GeolocationPosition | null | undefined,
): boolean {
  if (!currentPosition) return false // 현재 위치가 없으면 저장할 필요 없음

  const rawRequestTime = localStorage.getItem(REQUEST_TIME_KEY)
  if (!rawRequestTime) return true

  try {
    const requestTime = JSON.parse(rawRequestTime) as unknown
    if (typeof requestTime !== 'number') return true

    return Date.now() - requestTime >= FIVE_MINUTES_MS
  } catch {
    return true
  }
}

function validateStoredPosition(): boolean {
  const raw = localStorage.getItem(POSITION_STORAGE_KEY)
  if (!raw) return true

  try {
    const parsed = JSON.parse(raw) as Partial<StoredPosition>
    return (
      typeof parsed?.timestamp === 'number' &&
      typeof parsed?.coords?.latitude === 'number' &&
      typeof parsed?.coords?.longitude === 'number'
    )
  } catch (error) {
    console.error('Error parsing stored position:', error)
    return false
  }
}

export function savePositionToStorage(
  currentPosition: GeolocationPosition | null | undefined,
): void {
  if (!currentPosition) return
  if (!validateStoredPosition()) return

  const hasStoredPosition = !!localStorage.getItem(POSITION_STORAGE_KEY)
  if (hasStoredPosition && !shouldUpdatePositionStorage(currentPosition)) return

  const payload: StoredPosition = {
    coords: {
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude,
    },
    timestamp: currentPosition.timestamp,
  }

  localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(payload))
  localStorage.setItem(REQUEST_TIME_KEY, JSON.stringify(Date.now()))
}
