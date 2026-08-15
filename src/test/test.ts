export type LocationQuality = 'high' | 'fallback' | 'unavailable'

export type SmartLocationResult = {
  position: GeolocationPosition | null
  quality: LocationQuality
  needsCorrectionUI: boolean
  reason?: string
}

type SmartLocationOptions = {
  highAccuracyTimeoutMs?: number
  fallbackTimeoutMs?: number
}

const DEFAULT_HIGH_ACCURACY_TIMEOUT_MS = 5000
const DEFAULT_FALLBACK_TIMEOUT_MS = 4000

export async function getCurrentPositionWithFallback({
  highAccuracyTimeoutMs = DEFAULT_HIGH_ACCURACY_TIMEOUT_MS,
  fallbackTimeoutMs = DEFAULT_FALLBACK_TIMEOUT_MS,
}: SmartLocationOptions = {}): Promise<SmartLocationResult> {
  if (!('geolocation' in navigator)) {
    return {
      position: null,
      quality: 'unavailable',
      needsCorrectionUI: true,
      reason: 'geolocation-not-supported',
    }
  }

  try {
    const highAccuracyPosition = await getPosition({
      enableHighAccuracy: true,
      timeout: highAccuracyTimeoutMs,
      maximumAge: 0,
    })

    return {
      position: highAccuracyPosition,
      quality: 'high',
      needsCorrectionUI: false,
    }
  } catch (error) {
    if (!isTimeoutError(error)) {
      return {
        position: null,
        quality: 'unavailable',
        needsCorrectionUI: true,
        reason: getGeolocationErrorReason(error),
      }
    }

    return getFallbackPosition({
      fallbackTimeoutMs,
    })
  }
}

async function getFallbackPosition({
  fallbackTimeoutMs,
}: {
  fallbackTimeoutMs: number
}): Promise<SmartLocationResult> {
  try {
    const fallbackPosition = await getPosition({
      enableHighAccuracy: false,
      timeout: fallbackTimeoutMs,
      maximumAge: 30000,
    })

    return {
      position: fallbackPosition,
      quality: 'fallback',
      needsCorrectionUI: true,
      reason: 'high-accuracy-timeout',
    }
  } catch (error) {
    return {
      position: null,
      quality: 'unavailable',
      needsCorrectionUI: true,
      reason: getGeolocationErrorReason(error),
    }
  }
}

function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

function isTimeoutError(error: unknown): boolean {
  return isGeolocationError(error) && error.code === error.TIMEOUT
}

function getGeolocationErrorReason(error: unknown): string {
  if (!isGeolocationError(error)) {
    return 'unknown-error'
  }

  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'permission-denied'
    case error.POSITION_UNAVAILABLE:
      return 'position-unavailable'
    case error.TIMEOUT:
      return 'timeout'
    default:
      return 'unknown-error'
  }
}

function isGeolocationError(error: unknown): error is GeolocationPositionError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'number'
  )
}
