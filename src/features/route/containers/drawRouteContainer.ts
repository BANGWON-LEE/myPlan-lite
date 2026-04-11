import {
  ORDERED_MARKER_COLORS,
  ORDERED_ROUTE_COLORS,
  PURPOSE_TO_CATEGORY_KEY,
} from '@/data/constant'
import {
  renderMyMarker,
  renderRouteMarker,
} from '@/features/route/components/RouteMarker'
import { TmapPoiItem } from '@/types/placeType'
import { RoutePoint, tmapWalkingRouteResponseType } from '@/types/routeType'
import { ROUTE_MAP_ZOOM } from '@/util/map/mapFunctions'

function getOrderedRouteColor(index: number) {
  return ORDERED_ROUTE_COLORS[index] ?? ORDERED_ROUTE_COLORS.at(-1) ?? '#1d4ed8'
  //at(-1)은 배열의 마지막 요소를 반환하는 방법, 기존에 [arr.length-1]로 했던 것을 더 간결하게 표현
}

function getOrderedMarkerColor(index: number) {
  return (
    ORDERED_MARKER_COLORS[index] ??
    ORDERED_MARKER_COLORS.at(-1) ??
    'bg-blue-500'
  )
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
  const polylinePath = path.map(([x, y]) => new naver.maps.LatLng(y, x))

  return new naver.maps.Polyline({
    path: polylinePath,
    strokeColor: color,
    strokeWeight: 6,
    strokeOpacity: 0.9,
    map,
  })
}

function getDrawRouteMarker(
  map: naver.maps.Map,
  point: RoutePoint,
  title: string,
  order?: number,
) {
  const markerColor = getOrderedMarkerColor(order! - 1)

  return new naver.maps.Marker({
    position: new naver.maps.LatLng(point.y, point.x),
    map,
    title,
    icon: {
      content: renderRouteMarker({ index: order, color: markerColor }),
      anchor: new naver.maps.Point(15, 15),
    },
  })
}

export function getDrawMyMarker(
  map: naver.maps.Map,
  point: RoutePoint,
  title: string,
) {
  return new naver.maps.Marker({
    position: new naver.maps.LatLng(point.y, point.x),
    map,
    title,
    icon: {
      content: renderMyMarker(),
      anchor: new naver.maps.Point(12, 12),
    },
  })
}

export function createRouteMap(startPoint: RoutePoint) {
  const map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(startPoint.y, startPoint.x),
    zoom: ROUTE_MAP_ZOOM,
    mapTypeId: naver.maps.MapTypeId.NORMAL,
  })

  return map
}

export async function drawRouteByPoints(
  map: naver.maps.Map,
  routePoints: RoutePoint[],
  startPoint: RoutePoint,
) {
  let currentPoint = startPoint
  let latestPath: tmapWalkingRouteResponseType | null = null

  for (const [index, goalPoint] of routePoints.entries()) {
    const path = await getWalkingPath(currentPoint, goalPoint)

    drawPolyline(map, path.path, getOrderedRouteColor(index))
    getDrawRouteMarker(
      map,
      goalPoint,
      `${index + 1}. ${goalPoint.name}`,
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
export async function getInitialMapPosition(routePoints: RoutePoint[]) {
  if (routePoints.length === 0) return

  const map = createRouteMap(routePoints[0])
  return map
}
