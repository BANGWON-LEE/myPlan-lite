import { TmapPoiItem, TmapPoiResponse } from '@/types/placeType'
import { tmapWalkingRouteResponseType } from '@/types/routeType'

export type RoutePoint = {
  x: number
  y: number
  name: string
}

type SearchLocResponse = {
  searchPoiInfo: TmapPoiResponse
}

const ORDERED_ROUTE_COLORS = [
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#2563eb',
  '#1d4ed8',
] as const

function getOrderedRouteColor(index: number) {
  return ORDERED_ROUTE_COLORS[index] ?? ORDERED_ROUTE_COLORS.at(-1) ?? '#1d4ed8'
}

export function normalizePurpose(purpose: string) {
  const trimmedPurpose = purpose.trim()
  if (trimmedPurpose === '카페') return '커피'
  return trimmedPurpose
}

function filterPlaces(places: TmapPoiItem[]) {
  return places.filter(place => {
    return (
      !place.name.includes('주차장') &&
      !place.name.includes('정문') &&
      !place.name.includes('후문')
    )
  })
}

async function getCurrentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

async function getNearestPlace(
  startPoint: RoutePoint,
  purpose: string,
  time: string,
) {
  const params = new URLSearchParams({
    latitude: String(startPoint.y),
    longitude: String(startPoint.x),
    purpose,
    time,
  })

  const response = await fetch(`/api/searchLoc?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`${purpose} 장소를 불러오지 못했습니다.`)
  }

  const data = (await response.json()) as SearchLocResponse
  const nearestPlace = filterPlaces(data.searchPoiInfo?.pois?.poi ?? [])[0]

  if (!nearestPlace) {
    throw new Error(`${purpose} 장소를 찾지 못했습니다.`)
  }

  return {
    x: Number(nearestPlace.pnsLon),
    y: Number(nearestPlace.pnsLat),
    name: nearestPlace.name,
  }
}

async function getWalkingPath(startPoint: RoutePoint, goalPoint: RoutePoint) {
  const response = await fetch('/api/walking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startX: startPoint.x,
      startY: startPoint.y,
      endX: goalPoint.x,
      endY: goalPoint.y,
      reqCoordType: 'WGS84GEO',
      resCoordType: 'WGS84GEO',
      startName: encodeURIComponent(startPoint.name),
      endName: encodeURIComponent(goalPoint.name),
    }),
  })

  if (!response.ok) {
    throw new Error(`${startPoint.name}에서 ${goalPoint.name}까지 경로를 그리지 못했습니다.`)
  }

  return (await response.json()) as tmapWalkingRouteResponseType
}

function drawPolyline(
  map: naver.maps.Map,
  path: [number, number][],
  color: string,
) {
  const polylinePath = path.map(([x, y]) => new naver.maps.LatLng(y, x))

  return new naver.maps.Polyline({
    path: polylinePath,
    strokeColor: color,
    strokeWeight: 6,
    strokeOpacity: 0.9,
    map,
  })
}

function drawMarker(map: naver.maps.Map, point: RoutePoint, title: string) {
  return new naver.maps.Marker({
    position: new naver.maps.LatLng(point.y, point.x),
    map,
    title,
  })
}

async function drawOrderedRoute(
  map: naver.maps.Map,
  purposes: string[],
  time: string,
  startPoint: RoutePoint,
  depth = 0,
) {
  if (depth >= purposes.length) return

  const purpose = purposes[depth]
  const goalPoint = await getNearestPlace(startPoint, purpose, time)
  const path = await getWalkingPath(startPoint, goalPoint)

  drawPolyline(map, path.path, getOrderedRouteColor(depth))
  drawMarker(map, goalPoint, `${depth + 1}. ${goalPoint.name}`)

  await drawOrderedRoute(map, purposes, time, goalPoint, depth + 1)
}

export async function drawOrderedRouteMain(
  mapRef: React.MutableRefObject<naver.maps.Map | null>,
  purposes: string[],
  time: string,
) {
  const currentPosition = await getCurrentPosition()

  const startPoint = {
    x: currentPosition.coords.longitude,
    y: currentPosition.coords.latitude,
    name: '현재 위치',
  }

  const map =
    mapRef.current ??
    new naver.maps.Map('map', {
      center: new naver.maps.LatLng(startPoint.y, startPoint.x),
      zoom: 14,
      mapTypeId: naver.maps.MapTypeId.NORMAL,
    })

  mapRef.current = map

  drawMarker(map, startPoint, startPoint.name)
  await drawOrderedRoute(map, purposes, time, startPoint)
}
