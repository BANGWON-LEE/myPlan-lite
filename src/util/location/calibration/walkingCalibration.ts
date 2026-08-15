import { LocationCoordinate, LocationSample } from './types'

const LOW_ACCURACY_THRESHOLD_METERS = 80
const NORMAL_WALKING_WEIGHT = 0.45
const LOW_ACCURACY_WALKING_WEIGHT = 0.25

export function calibrateWalkingPosition(
  current: LocationSample,
  previous: LocationCoordinate,
) {
  // 도보 위치는 GPS 튐이 더 눈에 띄므로 낮은 가중치로 이전 좌표와 부드럽게 보간한다.
  const weight =
    typeof current.accuracy === 'number' &&
    current.accuracy > LOW_ACCURACY_THRESHOLD_METERS
      ? LOW_ACCURACY_WALKING_WEIGHT
      : NORMAL_WALKING_WEIGHT

  return interpolateCoordinate(previous, current, weight)
}

function interpolateCoordinate(
  from: LocationCoordinate,
  to: LocationCoordinate,
  weight: number,
) {
  // weight가 1에 가까울수록 새 좌표를 더 많이 반영하고, 0에 가까울수록 이전 좌표를 유지한다.
  return {
    latitude: from.latitude + (to.latitude - from.latitude) * weight,
    longitude: from.longitude + (to.longitude - from.longitude) * weight,
  }
}
