export type MovementMode = 'walking' | 'driving' | 'auto'

export type ResolvedMovementMode = Exclude<MovementMode, 'auto'>

export type LocationCoordinate = {
  latitude: number
  longitude: number
}

export type LocationSample = LocationCoordinate & {
  accuracy?: number | null
  speed?: number | null
  timestamp: number
}

export type CalibrationState = {
  coordinate: LocationCoordinate
  resolvedMode: ResolvedMovementMode
  movementModeSamples: LocationSample[]
}

export type CalibrationOptions = {
  mode?: MovementMode
}

export type CalibrationResult = {
  coordinate: LocationCoordinate
  state: CalibrationState
}
