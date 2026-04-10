import {
  createRouteMap,
  getDrawMyMarker,
} from '@/features/route/containers/drawRouteContainer'
import { simplePosition } from '@/types/marker'
import { PositionType } from '@/types/placeType'

export const DEFAULT_MAP_ZOOM = 15
export const ROUTE_MAP_ZOOM = 16
export const MARKER_MAP_ZOOM = 17

export const getMapOptions = (position: GeolocationPosition) => {
  const x = position.coords.latitude
  const y = position.coords.longitude

  return {
    center: new naver.maps.LatLng(x, y),
    zoom: DEFAULT_MAP_ZOOM,
  }
}

export const getMarkerMapOptions = (x: number, y: number) => {
  return {
    center: new naver.maps.LatLng(x, y),
    zoom: MARKER_MAP_ZOOM,
  }
}

export const getMapOptionsRoute = (position: PositionType) => {
  const x = position.coords.latitude
  const y = position.coords.longitude

  return {
    center: new naver.maps.LatLng(x, y),
    zoom: DEFAULT_MAP_ZOOM,
    mapTypeId: naver.maps.MapTypeId.NORMAL,
  }
}

export const getSearchMapOptions = (position: simplePosition) => {
  const x = Number(position.x)
  const y = Number(position.y)

  return {
    center: new naver.maps.LatLng(y, x),
    zoom: DEFAULT_MAP_ZOOM,
    mapTypeId: naver.maps.MapTypeId.NORMAL,
  }
}

export const getRouteMapOptions = (position: simplePosition) => {
  const x = Number(position.x)
  const y = Number(position.y)

  return {
    center: new naver.maps.LatLng(y, x),
    zoom: ROUTE_MAP_ZOOM,
    mapTypeId: naver.maps.MapTypeId.NORMAL,
  }
}

export const onLoadInitialRouteMap = () =>
  new naver.maps.Map(
    'map',
    new naver.maps.Map('map', {
      center: new naver.maps.LatLng(
        37.5665, // 서울
        126.978,
      ),
      zoom: DEFAULT_MAP_ZOOM,
      mapTypeId: naver.maps.MapTypeId.NORMAL,
    }),
  )

export const onLoadRouteMap = (position: naver.maps.Map) =>
  typeof position === 'undefined' ? onLoadInitialRouteMap : position

export const onLoadMap = (position: GeolocationPosition) =>
  new naver.maps.Map('map', getMapOptions(position))

export const onLoadMarkerMap = ({ x, y }: { x: number; y: number }) =>
  new naver.maps.Map('map', getMarkerMapOptions(x, y))

export const myMarker = (
  map: naver.maps.Map,
  position: GeolocationPosition,
) => {
  new naver.maps.Marker({
    position: new naver.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude,
    ),
    map: map,
  })
}

export function getCurrentPositionPromise(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation)
      reject(new Error('Geolocation is not supported'))
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
    )
  })
}

export async function moveMyMarkerPosition(
  map: naver.maps.Map,
  routePoints: GeolocationPosition,
) {
  const startPoint = {
    x: routePoints.coords.longitude,
    y: routePoints.coords.latitude,
    name: '현재 위치',
  }

  getDrawMyMarker(map, startPoint, startPoint.name)
  // return await drawRouteByPoints(map, routePoints, startPoint)
}
