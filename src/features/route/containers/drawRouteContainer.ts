import React from 'react'
import { ORDERED_ROUTE_COLORS, PURPOSE_TO_CATEGORY_KEY } from '@/data/constant'
import { renderRouteMarker } from '@/features/route/components/RouteMarker'
import { MarkerVariant } from '@/types/marker'
import { TmapPoiItem } from '@/types/placeType'
import { RoutePoint, tmapWalkingRouteResponseType } from '@/types/routeType'
import { createLatLng, ROUTE_MAP_ZOOM } from '@/util/map/mapFunctions'

type RouteOverlay = naver.maps.Marker | naver.maps.Polyline

function getOrderedRouteColor(index: number) {
  return ORDERED_ROUTE_COLORS[index] ?? ORDERED_ROUTE_COLORS.at(-1) ?? '#1d4ed8'
  //at(-1)은 배열의 마지막 요소를 반환하는 방법, 기존에 [arr.length-1]로 했던 것을 더 간결하게 표현
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
  const polylinePath = path.map(([x, y]) => createLatLng(y, x))

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
    position: createLatLng(point.y, point.x),
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
    center: createLatLng(startPoint.y, startPoint.x),
    zoom: ROUTE_MAP_ZOOM,
    mapTypeId: naver.maps.MapTypeId.NORMAL,
  })

  mapRef.current = map
  return map
}

async function drawRouteByPoints(
  map: naver.maps.Map,
  routePoints: RoutePoint[],
  startPoint: RoutePoint,
  routeOverlays: RouteOverlay[],
) {
  let currentPoint = startPoint
  let latestPath: tmapWalkingRouteResponseType | null = null

  for (const [index, goalPoint] of routePoints.entries()) {
    const path = await getWalkingPath(currentPoint, goalPoint)

    routeOverlays.push(drawPolyline(map, path.path, getOrderedRouteColor(index)))
    routeOverlays.push(
      drawMarker(
      map,
      goalPoint,
      `${index + 1}. ${goalPoint.name}`,
      'ordered',
      index + 1,
      ),
    )
    currentPoint = goalPoint
    latestPath = path
  }

  return latestPath
}

export function clearRouteOverlays(routeOverlays: RouteOverlay[]) {
  routeOverlays.forEach(overlay => overlay.setMap(null))
  routeOverlays.length = 0
}

export function getRouteStartPointFromPosition(
  position: GeolocationPosition,
): RoutePoint {
  return {
    x: position.coords.longitude,
    y: position.coords.latitude,
    name: '현재 위치',
  }
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
  startPoint: RoutePoint,
  routeOverlays: RouteOverlay[],
) {
  if (routePoints.length === 0) return

  clearRouteOverlays(routeOverlays)
  const map = mapRef.current ?? createRouteMap(mapRef, startPoint)
  map.setCenter(createLatLng(startPoint.y, startPoint.x))

  routeOverlays.push(drawMarker(map, startPoint, startPoint.name, 'current'))
  return await drawRouteByPoints(map, routePoints, startPoint, routeOverlays)
}
