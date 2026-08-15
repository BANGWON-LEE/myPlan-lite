import { LocationCoordinate, LocationSample } from './types'

const LOW_ACCURACY_THRESHOLD_METERS = 80
const NORMAL_DRIVING_WEIGHT = 0.8
const LOW_ACCURACY_DRIVING_WEIGHT = 0.5

export function calibrateDrivingPosition(
  current: LocationSample,
  previous: LocationCoordinate,
) {
  // 주행 중에는 좌표 반영 비율을 높여 마커가 실제 이동보다 늦게 따라오는 느낌을 줄인다.
  const weight =
    typeof current.accuracy === 'number' &&
    current.accuracy > LOW_ACCURACY_THRESHOLD_METERS
      ? LOW_ACCURACY_DRIVING_WEIGHT
      : NORMAL_DRIVING_WEIGHT

  return {
    latitude: previous.latitude + (current.latitude - previous.latitude) * weight,
    longitude:
      previous.longitude + (current.longitude - previous.longitude) * weight,
  }
}
