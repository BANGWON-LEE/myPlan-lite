import { initialPlaceObj } from '@/data/constant'
import {
  useRoutePathStore,
  useRoutePlaceIdxStore,
} from '@/stores/useRouteStore'
import { placeType } from '@/types/placeType'
import {
  goalRouteType,
  startRouteType,
  tmapWalkingRouteResponseType,
} from '@/types/routeType'
import {
  getCurrentPositionPromise,
  goalMarker,
  onLoadMarkerMap,
  setWalkPolyLine,
  startMarker,
} from '@/util/map/mapFunctions'
import { useEffect, useRef, useState } from 'react'

export default function RoutePlaceBottom(props: {
  place: { key: string; list: placeType | null }
  placeList: placeType[]
  currentIdx: number
  isDisabled: boolean
  toggleDisabled: (state: boolean) => void
}) {
  const { currentIdx, isDisabled, place, placeList, toggleDisabled } = props
  const routePath = useRoutePathStore(state => state.setPath)
  const [searchErrorMessage, setSearchErrorMessage] = useState('')
  const hasNoMorePlaces =
    placeList.length === 0 || currentIdx + 1 >= placeList.length

  function drawPolyLine(
    map: naver.maps.Map,
    path: tmapWalkingRouteResponseType,
    polyLine: (map: naver.maps.Map, path: [number, number][]) => void,
  ) {
    polyLine(map, path.path)
  }

  const requestIdRef = useRef(0)
  const latestRequestIdRef = useRef(0)
  const prevPathRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const hasRequestedInitialDrawRef = useRef(false)

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

    const path = (await res.json()) as tmapWalkingRouteResponseType
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
      const value = localStorage.getItem('position')
      if (!value) return null

      const parsedValue: unknown = JSON.parse(value)
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
    setMealIdx,
    setCoffeeIdx,
    setPharmacyIdx,
    setShoppingIdx,
    setKaraokeIdx,
    setTouristSpotIdx,
  } = useRoutePlaceIdxStore()

  function setRoutePlaceIdx(list: string, nextIdx: number) {
    switch (list) {
      case 'meal':
        setMealIdx(nextIdx)
        break
      case 'coffee':
        setCoffeeIdx(nextIdx)
        break
      case 'pharmacy':
        setPharmacyIdx(nextIdx)
        break
      case 'shopping':
        setShoppingIdx(nextIdx)
        break
      case 'karaoke':
        setKaraokeIdx(nextIdx)
        break
      case 'touristSpot':
        setTouristSpotIdx(nextIdx)
        break
      default:
        break
    }
  }

  async function handleSearchOtherPlace() {
    if (hasNoMorePlaces) {
      setSearchErrorMessage('불러올 장소가 없습니다.')
      return
    }

    setSearchErrorMessage('')

    for (const [offset, nextPlace] of placeList
      .slice(currentIdx + 1)
      .entries()) {
      if (!nextPlace) continue

      try {
        await drawMarker(
          Number(nextPlace.pnsLat),
          Number(nextPlace.pnsLon),
          nextPlace.name,
        )

        setRoutePlaceIdx(place.key, currentIdx + offset + 1)
        return
      } catch {
        toggleDisabled(false)
      }
    }

    setSearchErrorMessage('불러올 장소가 없습니다.')
  }

  useEffect(() => {
    if (hasRequestedInitialDrawRef.current) return
    if (!place.list) return

    hasRequestedInitialDrawRef.current = true
    drawMarker(
      Number(placeList[0].pnsLat),
      Number(placeList[0].pnsLon),
      placeList[0].name,
    )
  }, [place.list])

  return (
    <div className="w-1/4 grid">
      <button
        className="h-full w-full bg-amber-200"
        disabled={isDisabled}
        onClick={() => {
          void handleSearchOtherPlace()
        }}
      >
        <div
          className={`px-3 py-2 font-semibold ${searchErrorMessage ? 'text-red-500' : 'text-amber-600'}`}
        >
          {searchErrorMessage ? searchErrorMessage : '다른 장소 검색'}
        </div>
      </button>
    </div>
  )
}
