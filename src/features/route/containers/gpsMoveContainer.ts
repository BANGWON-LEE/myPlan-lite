import {
  EARTH_RADIUS_METER,
  GEOLOCATION_WATCH_OPTIONS,
  MIN_DISTANCE_METER,
  MIN_UPDATE_INTERVAL_MS,
} from '@/data/constant'
import {
  GpsCoordinate,
  GpsUpdateContext,
  GpsWatchCallbacks,
  GpsWatchHandlers,
  GpsWatchState,
} from '@/types/locationType'
import { createLatLng } from '@/util/map/mapFunctions'

// 거리 계산을 위해 단위 변환용 함수
function toRadians(value: number) {
  return (value * Math.PI) / 180
}

// GPS 상태 메시지를 화면에 출력한다.
function setGpsStatusMessage(message: string) {
  if (typeof window === 'undefined') return
  const messageContainer = document.getElementById('gps-status-message')
  if (!messageContainer) return
  messageContainer.innerHTML = message
}

// GPS 수신이 불안정할 때 사용자에게 안내 문구를 노출한다.
function showGpsUnstableMessage() {
  setGpsStatusMessage('gps가 불안정하여 위치가 변화되지 않습니다.')
}

// GPS 안내 문구를 제거한다.
function clearGpsStatusMessage() {
  setGpsStatusMessage('')
}

// GeolocationPosition 값을 앱에서 쓰는 좌표 타입으로 변환한다.
export function toGpsCoordinate(position: GeolocationPosition): GpsCoordinate {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  }
}

// 좌표+시간 값을 GeolocationPosition 형태로 변환한다.
export function toGeolocationPosition(
  coordinate: GpsCoordinate,
  timestamp: number,
): GeolocationPosition {
  const coords = {
    accuracy: 0,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    speed: null,
    toJSON: () =>
      ({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      }) as GeolocationCoordinates,
  } as GeolocationCoordinates

  return {
    coords,
    timestamp,
    toJSON: () =>
      ({
        coords: {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        },
        timestamp,
      }) as GeolocationPosition,
  }
}

// 두 좌표 사이의 실제 이동 거리(m)를 계산한다.
export function getDistanceMeter(
  from: GpsCoordinate,
  to: GpsCoordinate,
): number {
  const prevLat = toRadians(from.latitude)
  const nowLat = toRadians(to.latitude)
  const calculatedLatitudeDelta = nowLat - prevLat
  const calculatedLongitudeDelta = toRadians(to.longitude - from.longitude)

  // 하버사인 공식의 중간값(0~1): 위도/경도 차이를 구면 거리 계산용으로 합성한 값
  const haversineValue =
    Math.sin(calculatedLatitudeDelta / 2) *
      Math.sin(calculatedLatitudeDelta / 2) +
    Math.cos(prevLat) *
      Math.cos(nowLat) *
      Math.sin(calculatedLongitudeDelta / 2) *
      Math.sin(calculatedLongitudeDelta / 2)

  // 두 지점의 중심각(라디안): 지구 중심에서 본 두 좌표 사이의 각도
  const angularDistance = 2 * Math.atan2(
    Math.sqrt(haversineValue),
    Math.sqrt(1 - haversineValue),
  )
  return EARTH_RADIUS_METER * angularDistance
}

// 거리(5m 이상) + 시간(4초 이상) 혼합 조건으로 좌표 갱신 여부를 판단한다.
export function shouldUpdateCoordinateByRule({
  previousCoordinate,
  previousUpdatedAt,
  nextCoordinate,
  now = Date.now(),
}: GpsUpdateContext): boolean {
  if (!previousCoordinate || previousUpdatedAt === null) {
    return true
  }

  const movedDistance = getDistanceMeter(previousCoordinate, nextCoordinate)
  const elapsedTime = now - previousUpdatedAt

  return (
    movedDistance >= MIN_DISTANCE_METER && elapsedTime >= MIN_UPDATE_INTERVAL_MS
  )
}

// 기존 좌표 상태를 받아, 규칙 통과 시 새 좌표로 이동(갱신)한다.
export function moveCoordinateByRule(context: GpsUpdateContext) {
  const canUpdate = shouldUpdateCoordinateByRule(context)
  const timestamp = context.now ?? Date.now()

  if (!canUpdate) {
    return {
      didUpdate: false as const,
      coordinate: context.previousCoordinate,
      timestamp: context.previousUpdatedAt,
    }
  }

  return {
    didUpdate: true as const,
    coordinate: context.nextCoordinate,
    timestamp,
  }
}

// watchPosition 성공 콜백: 좌표를 규칙에 따라 필터링하고 필요한 경우에만 업데이트한다.
function handleWatchPositionSuccess(
  position: GeolocationPosition,
  state: GpsWatchState,
  handlers: GpsWatchHandlers,
) {
  const { onCoordinateUpdate, onRawPosition } = handlers

  onRawPosition?.(position)

  const nextCoordinate = toGpsCoordinate(position)
  const result = moveCoordinateByRule({
    previousCoordinate: state.previousCoordinate,
    previousUpdatedAt: state.previousUpdatedAt,
    nextCoordinate,
    now: position.timestamp,
  })

  if (!result.didUpdate || !result.coordinate || result.timestamp === null) {
    return
  }

  state.previousCoordinate = result.coordinate
  state.previousUpdatedAt = result.timestamp
  clearGpsStatusMessage()
  onCoordinateUpdate(result.coordinate, result.timestamp)
}

// watchPosition 실패 콜백: 경고 메시지를 노출하고 마지막 유효 좌표를 유지한다.
function handleWatchPositionError(
  error: GeolocationPositionError,
  state: GpsWatchState,
  handlers: GpsWatchHandlers,
) {
  const { onCoordinateUpdate, onError } = handlers

  showGpsUnstableMessage()
  state.hasShownGpsUnstableAlert = true

  if (state.previousCoordinate && state.previousUpdatedAt !== null) {
    onCoordinateUpdate(state.previousCoordinate, state.previousUpdatedAt)
  }

  onError?.(error)
}

// GPS watch를 시작하고, 해제 함수를 반환한다.
export function startGpsWatch({
  onCoordinateUpdate,
  onRawPosition,
  onError,
}: GpsWatchCallbacks) {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    showGpsUnstableMessage()
    return () => {}
  }

  const state: GpsWatchState = {
    previousCoordinate: null,
    previousUpdatedAt: null,
    hasShownGpsUnstableAlert: false,
  }
  const handlers: GpsWatchHandlers = {
    onCoordinateUpdate,
    onRawPosition,
    onError,
  }

  const watchId = navigator.geolocation.watchPosition(
    position => handleWatchPositionSuccess(position, state, handlers),
    error => handleWatchPositionError(error, state, handlers),
    GEOLOCATION_WATCH_OPTIONS,
  )

  return () => {
    navigator.geolocation.clearWatch(watchId)
  }
}

// 시작 좌표에서 도착 좌표까지, 현재 진행 정도만큼 중간 좌표를 계산한다.
function interpolateCoordinate(
  from: GpsCoordinate,
  to: GpsCoordinate,
  progress: number,
): GpsCoordinate {
  return {
    latitude: from.latitude + (to.latitude - from.latitude) * progress,
    longitude: from.longitude + (to.longitude - from.longitude) * progress,
  }
}

// 마커를 보간 이동시켜 순간이동처럼 보이지 않도록 만든다.
export function animateMarkerToCoordinate(
  marker: naver.maps.Marker,
  to: GpsCoordinate,
  durationMs = 1200,
) {
  const startPosition = marker.getPosition()
  const from: GpsCoordinate = {
    latitude: startPosition.y,
    longitude: startPosition.x,
  }

  if (typeof window === 'undefined') {
    marker.setPosition(createLatLng(to.latitude, to.longitude))
    return
  }

  const startAt = performance.now()

  const run = (now: number) => {
    const elapsed = now - startAt
    const progress = Math.min(elapsed / durationMs, 1)
    const next = interpolateCoordinate(from, to, progress)

    marker.setPosition(createLatLng(next.latitude, next.longitude))

    if (progress < 1) {
      requestAnimationFrame(run)
    }
  }

  requestAnimationFrame(run)
}
