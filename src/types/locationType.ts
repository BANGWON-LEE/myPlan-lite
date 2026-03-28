export type GpsCoordinate = {
  latitude: number
  longitude: number
}

export type GpsUpdateContext = {
  previousCoordinate: GpsCoordinate | null
  previousUpdatedAt: number | null
  nextCoordinate: GpsCoordinate
  now?: number
}

export type GpsWatchCallbacks = {
  onCoordinateUpdate: (coordinate: GpsCoordinate, timestamp: number) => void
  onRawPosition?: (position: GeolocationPosition) => void
  onError?: (error: GeolocationPositionError) => void
  throttleIntervalMs?: number
}

export type GpsWatchState = {
  previousCoordinate: GpsCoordinate | null
  previousUpdatedAt: number | null
  hasShownGpsUnstableAlert: boolean
}

export type GpsWatchHandlers = {
  onCoordinateUpdate: (coordinate: GpsCoordinate, timestamp: number) => void
  onRawPosition?: (position: GeolocationPosition) => void
  onError?: (error: GeolocationPositionError) => void
}
