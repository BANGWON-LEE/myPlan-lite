import { LocationCoordinate, LocationSample } from './types'

const EARTH_RADIUS_METERS = 6371000

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

export function getDistanceMeters(
  from: LocationCoordinate,
  to: LocationCoordinate,
) {
  // 위경도 좌표 사이의 직선 거리를 구하기 위해 지구 곡률을 반영한 haversine 공식을 사용한다.
  const latDelta = toRadians(to.latitude - from.latitude)
  const lonDelta = toRadians(to.longitude - from.longitude)
  const fromLat = toRadians(from.latitude)
  const toLat = toRadians(to.latitude)

  const haversine =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(fromLat) *
      Math.cos(toLat) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2)

  return (
    2 *
    EARTH_RADIUS_METERS *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  )
}

export function getSpeedMetersPerSecond(
  previous: LocationSample,
  current: LocationSample,
) {
  const elapsedSeconds = (current.timestamp - previous.timestamp) / 1000

  if (elapsedSeconds <= 0) return null

  return getDistanceMeters(previous, current) / elapsedSeconds
}
