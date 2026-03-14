import { initialPlaceObj } from '@/data/constant'
import {
  useRoutePathStore,
  useRoutePlaceIdxStore,
} from '@/stores/useRouteStore'
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
  placeList: placeType[]
  currentIdx: number
  isDisabled: boolean
  toggleDisabled: (state: boolean) => void
}) {
  const { currentIdx, isDisabled, place, placeList, toggleDisabled } = props
  const routePath = useRoutePathStore(state => state.setPath)
  const hasNoMorePlaces =
    placeList.length === 0 || currentIdx + 1 >= placeList.length

  function drawPolyLine(
    map: naver.maps.Map,
    path: tmapRoutePathType,
    polyLine: (map: naver.maps.Map, path: [[number, number]]) => void,
  ) {
    polyLine(map, path.path)
  }

  const requestIdRef = useRef(0)
  const latestRequestIdRef = useRef(0)

  async function onDrawMarkerLine(
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

    await getPathWalk(
      map,
      { x: currentX, y: currentY },
      { x: lon, y: lat },
      placeName || initialPlaceObj.name,
    )

    const mapLoadCheck = mapStartSignal !== null && mapResultSignal !== null
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
      reqCoordType: 'WGS84GEO',
      resCoordType: 'WGS84GEO',
      startName: encodeURIComponent('내 위치'),
      endName: encodeURIComponent(placeName),
    }

    const res = await fetch('/api/walking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!res.ok) {
      throw new Error('failed to fetch walking path')
    }

    const path = (await res.json()) as tmapRoutePathType
    routePath(path)
    drawPolyLine(map, path, setWalkPolyLine)
  }

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

  async function getPositionWithFallback(): Promise<GeolocationPosition | null> {
    const cachedPosition = getPositionFromStorage()
    if (cachedPosition) return cachedPosition

    if (typeof window === 'undefined' || !navigator.geolocation) return null

    try {
      const currentPosition = await getCurrentPositionPromise()
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
    const position = await getPositionWithFallback()
    if (!position) {
      throw new Error('position is empty')
    }

    const currentX = position.coords.longitude
    const currentY = position.coords.latitude

    const requestId = ++requestIdRef.current
    latestRequestIdRef.current = requestId
    if (!validatePath(lat, lon)) {
      throw new Error('same path request')
    }
    if (isDisabled) {
      throw new Error('search is disabled')
    }

    toggleDisabled(true)

    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        onDrawMarkerLine(requestId, lat, lon, currentX, currentY, placeName)
          .then(resolve)
          .catch(reject)
      }, 1000)
    })
  }

  const {
    incMealIdx,
    incCoffeeIdx,
    incPharmacyIdx,
    incShoppingIdx,
    incKaraokeIdx,
    incTouristSpotIdx,
  } = useRoutePlaceIdxStore()

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
      case 'karaoke':
        incKaraokeIdx()
        break
      case 'touristSpot':
        incTouristSpotIdx()
        break
      default:
        break
    }
  }

  async function handleSearchOtherPlace() {
    if (hasNoMorePlaces) return

    const nextPlace = placeList[currentIdx + 1]

    if (!nextPlace) return

    try {
      await drawMarker(
        Number(nextPlace.pnsLat),
        Number(nextPlace.pnsLon),
        nextPlace.name,
      )

      changeRoutePlaceIdx(place.key)
    } catch {
      toggleDisabled(false)
    }
  }

  return (
    <div className="w-1/4 grid">
      <button
        className="h-full w-full bg-amber-200"
        disabled={isDisabled || hasNoMorePlaces}
        onClick={handleSearchOtherPlace}
      >
        <div className="px-3 py-2 font-semibold text-amber-600">
          다른 장소 검색
        </div>
      </button>
      {hasNoMorePlaces && (
        <div className="px-2 py-1 text-center text-sm font-semibold text-red-500">
          다른 장소를 불러오지 못했습니다.
        </div>
      )}
    </div>
  )
}
