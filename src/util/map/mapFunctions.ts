export const DEFAULT_MAP_ZOOM = 18
export const ROUTE_MAP_ZOOM = 17
export const MARKER_MAP_ZOOM = 17

let routeMapInstance: naver.maps.Map | null = null

export function createLatLng(latitude: number, longitude: number) {
  return new naver.maps.LatLng(latitude, longitude)
}

export function getRouteMapInstance() {
  return routeMapInstance
}

export function setRouteMapInstance(map: naver.maps.Map) {
  routeMapInstance = map
}

export const onLoadInitialRouteMap = () =>
  new naver.maps.Map(
    'map',
    new naver.maps.Map('map', {
      center: createLatLng(
        37.5665, // 서울
        126.978,
      ),
      zoom: DEFAULT_MAP_ZOOM,
      mapTypeId: naver.maps.MapTypeId.NORMAL,
    }),
  )

export const onLoadRouteMap = (position: naver.maps.Map) =>
  typeof position === 'undefined' ? onLoadInitialRouteMap : position

export function getCurrentPositionPromise(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}
