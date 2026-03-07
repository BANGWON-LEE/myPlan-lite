import { initialPlaceObj } from '@/data/constant'
import { useRoutePlaceIdxStore } from '@/stores/useRouteStore'
import { placeType } from '@/types/placeType'
import {
  goalRouteType,
  startRouteType,
  tmapRoutePathType,
} from '@/types/routeType'
import {
  getCurrentPositionPromise,
  goalMarker,
  onLoadMarkerMap,
  setWalkPolyLine,
  startMarker,
} from '@/util/map/mapFunctions'
import { useRef } from 'react'

export default function RoutePlaceBottom(props: {
  place: { key: string; list: placeType | null }
  isDisabled: boolean
  toggleDisabled: (state: boolean) => void
}) {
  const { isDisabled, place, toggleDisabled } = props

  function drawPolyLine(
    map: naver.maps.Map,
    path: tmapRoutePathType,
    polyLine: (map: naver.maps.Map, path: [[number, number]]) => void,
  ) {
    polyLine(map, path.path)
  }

  const requestIdRef = useRef(0) // 요청 번호 발급기
  const latestRequestIdRef = useRef(0) // 마지막 요청 번호

  function onDrawMarkerLine(
    requestId: number,
    lat: number,
    lon: number,
    currentX: number,
    currentY: number,
    placeName: string | undefined,
  ) {
    if (requestId !== latestRequestIdRef.current) return

    const map = onLoadMarkerMap({ x: lat, y: lon })
    const mapStartSignal = startMarker(map, { x: currentX, y: currentY })
    const mapResultSignal = goalMarker(map, { x: lon, y: lat })

    const mapPolyLine = getPathWalk(
      map,
      { x: currentX, y: currentY },
      { x: lon, y: lat },
      placeName || initialPlaceObj.name,
    )

    const mapLoadCheck =
      mapStartSignal !== null &&
      mapResultSignal !== null &&
      mapPolyLine !== null

    if (mapLoadCheck) toggleDisabled(false)
  }

  async function getPathWalk(
    map: naver.maps.Map,
    startInfoState: startRouteType,
    goalInfoState: goalRouteType,
    placeName: string,
  ) {
    const requestData = {
      startX: startInfoState.x,
      startY: startInfoState.y,
      endX: goalInfoState.x,
      endY: goalInfoState.y,
      // passList: '경도,위도_경도,위도_경도,위도',
      reqCoordType: 'WGS84GEO',
      resCoordType: 'WGS84GEO',
      startName: encodeURIComponent('내 위치'),
      // startName: startInfoState.start.name,
      endName: encodeURIComponent(placeName),
    }

    const res = await fetch('/api/walking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    const path = await res.json()

    drawPolyLine(map, path, setWalkPolyLine)
  }

  // localStorage 값이 GeolocationPosition 형태인지 최소 필드만 검증한다.
  function isValidPositionData(
    value: unknown,
  ): value is { coords: { latitude: number; longitude: number } } {
    if (!value || typeof value !== 'object') return false

    const coords = (value as { coords?: unknown }).coords
    if (!coords || typeof coords !== 'object') return false

    const latitude = (coords as { latitude?: unknown }).latitude
    const longitude = (coords as { longitude?: unknown }).longitude

    return typeof latitude === 'number' && typeof longitude === 'number'
  }

  // 저장된 position를 안전하게 파싱하고, 유효하지 않으면 null을 반환한다.
  const getPositionFromStorage = (): GeolocationPosition | null => {
    if (typeof window === 'undefined') return null

    try {
      const v = localStorage.getItem('position')
      if (!v) return null

      const parsedValue: unknown = JSON.parse(v)
      if (!isValidPositionData(parsedValue)) return null

      return parsedValue as GeolocationPosition
    } catch {
      return null
    }
  }

  // 캐시 우선 사용, 실패 시 현재 위치를 조회해 캐시를 복구한다.
  async function getPositionWithFallback(): Promise<GeolocationPosition | null> {
    const cachedPosition = getPositionFromStorage()
    if (cachedPosition) return cachedPosition

    if (typeof window === 'undefined' || !navigator.geolocation) return null

    try {
      const currentPosition = await getCurrentPositionPromise()
      // 이후 경로 탐색에서 동일 값을 재사용할 수 있도록 캐시에 저장한다.
      localStorage.setItem('position', JSON.stringify(currentPosition))
      return currentPosition
    } catch {
      return null
    }
  }

  const prevPathRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  function validatePath(lat: number, lon: number) {
    const prev = prevPathRef.current
    if (lat === prev.x && lon === prev.y) return false

    prev.x = lat
    prev.y = lon
    return true
  }

  async function drawMarker(
    lat: number,
    lon: number,
    placeName: string | undefined,
  ) {
    // 캐시 누락/오염을 fallback으로 복구한 뒤에만 좌표 접근한다.
    const position = await getPositionWithFallback()
    if (!position) return

    const currentX = position.coords.longitude
    const currentY = position.coords.latitude

    const requestId = ++requestIdRef.current
    latestRequestIdRef.current = requestId
    if (!validatePath(lat, lon)) return
    if (isDisabled) return
    toggleDisabled(true)
    setTimeout(() => {
      onDrawMarkerLine(requestId, lat, lon, currentX, currentY, placeName)
    }, 1000)
  }
  const { incMealIdx, incCoffeeIdx, incPharmacyIdx, incShoppingIdx } =
    useRoutePlaceIdxStore()

  function changeRoutePlaceIdx(list: string) {
    switch (list) {
      case 'meal':
        incMealIdx()
        break
      case 'coffee':
        incCoffeeIdx()
        break
      case 'pharmacy':
        incPharmacyIdx()
        break
      case 'shopping':
        incShoppingIdx()
        break
      default:
        break
    }
  }

  return (
    <div className="w-1/4 grid  ">
      <button
        className="h-full  w-full bg-slate-200"
        disabled={isDisabled}
        onClick={() =>
          drawMarker(
            Number(place.list?.pnsLat),
            Number(place.list?.pnsLon),
            place.list?.name,
          )
        }
      >
        <div className="text-indigo-600 font-semibold">경로 찾기</div>
      </button>
      <button
        onClick={() => changeRoutePlaceIdx(place.key)}
        className="h-full  w-full bg-amber-200"
      >
        <div className="text-amber-600 font-semibold">다른 장소</div>
      </button>
    </div>
  )
}
