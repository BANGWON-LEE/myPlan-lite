import React from 'react'
import { ORDERED_ROUTE_COLORS, PURPOSE_TO_CATEGORY_KEY } from '@/data/constant'
import { renderRouteMarker } from '@/features/route/components/RouteMarker'
import { MarkerVariant } from '@/types/marker'
import { TmapPoiItem } from '@/types/placeType'
import {
  RoutePoint,
  SearchLocResponse,
  tmapWalkingRouteResponseType,
} from '@/types/routeType'
import { filterPlaceList } from '@/util/common/common'
import { getCurrentPositionPromise, ROUTE_MAP_ZOOM } from '@/util/map/mapFunctions'

function getOrderedRouteColor(index: number) {
  return ORDERED_ROUTE_COLORS[index] ?? ORDERED_ROUTE_COLORS.at(-1) ?? '#1d4ed8'
}

export function normalizePurpose(purpose: string) {
  const trimmedPurpose = purpose.trim()
  if (trimmedPurpose === '카페') return '커피'
  return trimmedPurpose
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
  const nearestPlace = filterPlaceList(data.searchPoiInfo?.pois?.poi ?? [])[0]

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
    throw new Error(
      `${startPoint.name}에서 ${goalPoint.name}까지 경로를 그리지 못했습니다.`,
    )
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

function drawMarker(
  map: naver.maps.Map,
  point: RoutePoint,
  title: string,
  variant: MarkerVariant,
  order?: number,
) {
  const markerColor =
    variant === 'ordered' && typeof order === 'number'
      ? getOrderedRouteColor(order - 1)
      : '#2563eb'

  return new naver.maps.Marker({
    position: new naver.maps.LatLng(point.y, point.x),
    map,
    title,
    icon: {
      content: renderRouteMarker({ variant, index: order, color: markerColor }),
      anchor: new naver.maps.Point(
        variant === 'current' ? 12 : 15,
        variant === 'current' ? 12 : 15,
      ),
    },
  })
}

function createRouteMap(
  mapRef: React.MutableRefObject<naver.maps.Map | null>,
  startPoint: RoutePoint,
) {
  const map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(startPoint.y, startPoint.x),
    zoom: ROUTE_MAP_ZOOM,
    mapTypeId: naver.maps.MapTypeId.NORMAL,
  })

  mapRef.current = map
  return map
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
  drawMarker(
    map,
    goalPoint,
    `${depth + 1}. ${goalPoint.name}`,
    'ordered',
    depth + 1,
  )

  await drawOrderedRoute(map, purposes, time, goalPoint, depth + 1)
}

async function drawRouteByPoints(
  map: naver.maps.Map,
  routePoints: RoutePoint[],
  startPoint: RoutePoint,
) {
  let currentPoint = startPoint
  let latestPath: tmapWalkingRouteResponseType | null = null

  for (const [index, goalPoint] of routePoints.entries()) {
    const path = await getWalkingPath(currentPoint, goalPoint)

    drawPolyline(map, path.path, getOrderedRouteColor(index))
    drawMarker(
      map,
      goalPoint,
      `${index + 1}. ${goalPoint.name}`,
      'ordered',
      index + 1,
    )
    currentPoint = goalPoint
    latestPath = path
  }

  return latestPath
}

export function getRoutePointFromPlace(
  place: Pick<TmapPoiItem, 'pnsLon' | 'pnsLat' | 'name'>,
): RoutePoint {
  return {
    x: Number(place.pnsLon),
    y: Number(place.pnsLat),
    name: place.name,
  }
}

export function getSelectedRoutePoints(
  purposes: string[],
  routeList: Record<string, TmapPoiItem[]>,
  routePlaceIndexes: Record<string, number>,
) {
  return purposes
    .map(purpose => {
      const categoryKey = PURPOSE_TO_CATEGORY_KEY[purpose]
      if (!categoryKey) return null

      const selectedIndex = routePlaceIndexes[categoryKey] ?? 0
      const selectedPlace = routeList[categoryKey]?.[selectedIndex]

      return selectedPlace ? getRoutePointFromPlace(selectedPlace) : null
    })
    .filter((point): point is RoutePoint => point !== null)
}

// 현재 위치를 시작점으로 지도와 출발 마커를 만든 뒤,
// 이미 선택된 장소 목록(routePoints)을 전달받은 순서대로 연결해 경로를 그린다.
export async function drawOrderedRouteByPlacesMain(
  mapRef: React.MutableRefObject<naver.maps.Map | null>,
  routePoints: RoutePoint[],
) {
  if (routePoints.length === 0) return

  const currentPosition = await getCurrentPositionPromise()
  const startPoint = {
    x: currentPosition.coords.longitude,
    y: currentPosition.coords.latitude,
    name: '현재 위치',
  }

  const map = createRouteMap(mapRef, startPoint)

  drawMarker(map, startPoint, startPoint.name, 'current')
  return await drawRouteByPoints(map, routePoints, startPoint)
}
