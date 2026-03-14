import { simplePosition } from '@/types/marker'
import { checkEmptyString } from '../common/common'
import { PositionType } from '@/types/placeType'

export const getMapOptions = (position: GeolocationPosition) => {
  // console.log('posi', position)
  // const checkPositionType = 'coords' in position

  const x = position.coords.latitude
  const y = position.coords.longitude

  return {
    center: new naver.maps.LatLng(x, y),
    zoom: 14,
    // mapTypeId: naver.maps.MapTypeId.NORMAL,s
  }
}

export const getMarkerMapOptions = (x: number, y: number) => {
  // console.log('posi', position)
  // const checkPositionType = 'coords' in position

  return {
    center: new naver.maps.LatLng(x, y),
    zoom: 17,
    // mapTypeId: naver.maps.MapTypeId.NORMAL,s
  }
}

export const getMapOptionsRoute = (position: PositionType) => {
  // console.log('posi', position)
  // const checkPositionType = 'coords' in position

  const x = position.coords.latitude
  const y = position.coords.longitude

  return {
    center: new naver.maps.LatLng(x, y),
    zoom: 14,
    mapTypeId: naver.maps.MapTypeId.NORMAL,
  }
}

export const getSearchMapOptions = (position: simplePosition) => {
  // console.log('검색 후', position)
  const x = Number(position.x)
  const y = Number(position.y)

  return {
    center: new naver.maps.LatLng(y, x),
    zoom: 14,
    mapTypeId: naver.maps.MapTypeId.NORMAL,
  }
}

export const getRouteMapOptions = (position: simplePosition) => {
  // console.log('검색 후', position)
  const x = Number(position.x)
  const y = Number(position.y)

  return {
    center: new naver.maps.LatLng(y, x),
    zoom: 15,
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
        // pos ? pos.coords.latitude : 37.5665,
        // pos ? pos.coords.longitude : 126.978,
      ),
      zoom: 14,
      mapTypeId: naver.maps.MapTypeId.NORMAL,
    }),
  )

export const onLoadRouteMap = (
  // position: GeolocationPosition,
  position: naver.maps.Map,
) => (typeof position === 'undefined' ? onLoadInitialRouteMap : position)

export const onLoadMap = (position: GeolocationPosition) =>
  new naver.maps.Map('map', getMapOptions(position))

export const onLoadMarkerMap = ({ x, y }: { x: number; y: number }) =>
  new naver.maps.Map('map', getMarkerMapOptions(x, y))

// export const onSearchLoadMap = (position: simplePosition) =>
//   new naver.maps.Map('map', getSearchMapOptions(position))

// export const onLoadRouteMap = (position: simplePosition) =>
//   new naver.maps.Map('map', getRouteMapOptions(position))

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
    // position: position.destinationPoint(90, 15),
    position: position,
    icon: {
      url: '../../assets/start.png',
      // size: new naver.maps.Size(128, 128),
      // scaledSize: new naver.maps.Size(32, 32),
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

export const mySearchMarker = (
  map: naver.maps.Map,
  position: simplePosition,
) => {
  const x = Number(position.x)
  const y = Number(position.y)

  new naver.maps.Marker({
    position: new naver.maps.LatLng(y, x),
    map: map,
  })
}
// const infowindow = () => new naver.maps.InfoWindow()

export function setGeolocationOnMap(position: GeolocationPosition): void {
  // console.log('setGeolocationOnMap')
  const geolocationError =
    '<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>'

  const map = onLoadMap(position)
  const infoMark = infowindow()

  switch (navigator.geolocation) {
    case undefined: {
      infoMark.setContent(geolocationError)
      infoMark.open(map, map.getCenter())
      break
    }
    default: {
      navigator.geolocation.getCurrentPosition(onSuccessGeolocation)
    }
  }
}

function onSuccessGeolocation(position: GeolocationPosition) {
  const location = new naver.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude,
  )

  const map = onLoadMap(position)
  // const infoMark = infowindow()

  map.setCenter(location) // 얻은 좌표를 지도의 중심으로 설정합니다.
  map.setZoom(12) // 지도의 줌 레벨을 변경합니다.
  myMarker(map, position)
}

export async function getPlaceLocation(
  text: string,
  formatPlaceLocation: (addresses: naver.maps.Service.AddressItemV2[]) => void,
) {
  checkEmptyString(text)

  naver.maps.Service.geocode(
    {
      query: text,
    },
    (status, response) => {
      if (status !== naver.maps.Service.Status.OK) {
        return alert('장소를 찾을 수 없습니다.')
      }

      const result = response.v2 // 검색 결과의 컨테이너
      const address = result.addresses
      formatPlaceLocation(address)
    },
  )
}

// 현재 내 위치의 주소를 문자열로 반환
export async function getMyLocAddress(
  position: GeolocationPosition,
): Promise<naver.maps.Service.ReverseGeocodeAddress> {
  const x = position.coords.latitude
  const y = position.coords.longitude

  return new Promise((resolve, reject) => {
    naver.maps.Service.reverseGeocode(
      {
        coords: new naver.maps.LatLng(x, y),
      },
      (status, response) => {
        if (status !== naver.maps.Service.Status.OK) {
          reject('Something went wrong with reverse geocode!')
          return
        }
        const address = response.v2.address
        return resolve(address)
      },
    )
  })
}
export function getCurrentPositionPromise(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

export const setCarPolyLine = (
  map: naver.maps.Map,
  path: [[number, number]],
) => {
  const pathFromAPI = path.map(([x, y]) => new naver.maps.LatLng(y, x))

  new naver.maps.Polyline({
    path: pathFromAPI,
    strokeColor: '#00bfff',
    strokeWeight: 5,
    map: map,
  })
}

export const setWalkPolyLine = (
  map: naver.maps.Map,
  path: [number, number][],
) => {
  const formatPath = path.map(([x, y]) => {
    return [x, y]
  })

  const pathFromAPI = formatPath.map(([x, y]) => new naver.maps.LatLng(y, x))

  new naver.maps.Polyline({
    path: pathFromAPI,
    strokeColor: '#90ee90',
    strokeWeight: 5,
    map: map,
  })
}

export function getMyLocation(position: GeolocationPosition) {
  const map = onLoadMap(position)

  const location = new naver.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude,
  )

  naver.maps.Event.once(map, 'init', () => {
    map.setCenter(location)
  })
  // infoMark.open(map, location)
  myMarker(map, position)
}
