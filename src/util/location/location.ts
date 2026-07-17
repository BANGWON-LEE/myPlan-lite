export type LocationQuality = 'high' | 'fallback' | 'unavailable'

export type SmartLocationResult = {
  position: GeolocationPosition | null
}

type SmartLocationOptions = {
  highAccuracyTimeoutMs?: number
  fallbackTimeoutMs?: number
}

const DEFAULT_HIGH_ACCURACY_TIMEOUT_MS = 3000
const DEFAULT_FALLBACK_TIMEOUT_MS = 4000

export async function getCurrentPositionWithFallback({
  highAccuracyTimeoutMs = DEFAULT_HIGH_ACCURACY_TIMEOUT_MS,
  fallbackTimeoutMs = DEFAULT_FALLBACK_TIMEOUT_MS,
}: SmartLocationOptions = {}): Promise<SmartLocationResult> {
  if (!('geolocation' in navigator)) {
    return {
      position: null,
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
    }
  } catch {
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
    }
  } catch {
    return {
      position: null,
    }
  }
}

function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}
