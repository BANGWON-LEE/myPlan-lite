import { simplePosition } from '@/types/marker'
import { checkEmptyString } from '../common/common'
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

export const infowindow = () =>
  new naver.maps.InfoWindow({
    content: '<div style="padding:10px;">i am here</div>',
  })

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

export const startMarker = (
  map: naver.maps.Map,
  startPosition: { x: number; y: number },
) => {
  const position = new naver.maps.LatLng(startPosition.y, startPosition.x)

  return new naver.maps.Marker({
    position: position,
    icon: {
      url: '../../assets/start.png',
      size: new naver.maps.Size(128, 128),
      origin: new naver.maps.Point(0, 0),
      scaledSize: new naver.maps.Size(32, 32),
      anchor: new naver.maps.Point(16, 32),
    },
    map: map,
  })
}
export const goalMarker = (
  map: naver.maps.Map,
  goalPosition: { x: number; y: number },
) => {
  const position = new naver.maps.LatLng(goalPosition.y, goalPosition.x)

  return new naver.maps.Marker({
    position: position,
    icon: {
      url: '/assets/goal.png', // ✅ 여기 절대 경로
      size: new naver.maps.Size(128, 128),
      origin: new naver.maps.Point(0, 0),
      scaledSize: new naver.maps.Size(32, 32),
      anchor: new naver.maps.Point(16, 32),
    },
    map: map,
  })
}

export function getCurrentPositionPromise(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}
