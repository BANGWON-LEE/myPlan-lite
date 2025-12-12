import { SearchPlaceType, simplePosition } from '@/types/marker'
import { checkEmptyString, formatMyLocation } from '../common/common'

export const getMapOptions = (position: GeolocationPosition) => {
  // const checkPositionType = 'coords' in position

  const x = position.coords.latitude
  const y = position.coords.longitude

  return {
    center: new naver.maps.LatLng(x, y),
    zoom: 14,
    mapTypeId: naver.maps.MapTypeId.NORMAL,
    disableDoubleTapZoom: true,
    disableTwoFingerTapZoom: true,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
  }
}

// export const getSearchMapOptions = (position: simplePosition) => {
//   // console.log('검색 후', position)
//   const x = Number(position.x)
//   const y = Number(position.y)

//   return {
//     center: new naver.maps.LatLng(y, x),
//     zoom: 14,
//     mapTypeId: naver.maps.MapTypeId.NORMAL,
//   }
// }

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

export const onLoadMap = (position: GeolocationPosition) =>
  new naver.maps.Map('map', getMapOptions(position))

//export const onSearchLoadMap = (position: simplePosition) =>
//  new naver.maps.Map('map', getSearchMapOptions(position))

//xport const onLoadRouteMap = (position: simplePosition) =>
//  new naver.maps.Map('map', getRouteMapOptions(position))

export const myMarker = (
  map: naver.maps.Map,
  position: GeolocationPosition
) => {
  new naver.maps.Marker({
    position: new naver.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    ),
    map: map,
  })
}

export const startMarker = (
  map: naver.maps.Map,
  startPosition: { x: number; y: number }
) => {
  const position = new naver.maps.LatLng(startPosition.y, startPosition.x)

  new naver.maps.Marker({
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
  goalPosition: { x: number; y: number }
) => {
  const position = new naver.maps.LatLng(goalPosition.y, goalPosition.x)

  new naver.maps.Marker({
    // position: position.destinationPoint(90, 15),
    position: position,
    icon: {
      url: '../../assets/end.png',
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
  position: simplePosition
) => {
  const x = Number(position.x)
  const y = Number(position.y)

  new naver.maps.Marker({
    position: new naver.maps.LatLng(y, x),
    map: map,
  })
}



// export function formatPlaceLocation(
//   addresses: naver.maps.Service.AddressItemV2[]
// ) {
//   // console.log('check', addresses)

//   const position = addresses.map(el => {
//     return { x: el.x, y: el.y }
//   })

//   const map = onSearchLoadMap(position[0])

//   position.forEach(el => {
//     const position = { x: el.x, y: el.y }

//     mySearchMarker(map, position)
//   })
// }


export async function getPlaceLocation(
  text: string,
  formatPlaceLocation: (addresses: naver.maps.Service.AddressItemV2[]) => void
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
    }
  )
}



// 현재 내 위치의 주소를 문자열로 반환
export async function getMyLocAddress(
  position: GeolocationPosition
): Promise<naver.maps.Service.ReverseGeocodeAddress> {
  const x = position.coords.latitude
  const y = position.coords.longitude

  // if (naver.maps.Service === undefined || naver.maps.Service === null) {
  //   alert('아나 스벌')
  //   setTimeout(() => {})
  // }

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
      }
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
  path: [[number, number]]
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
  path: [[number, number]]
) => {
  const formatPath = path.map(([x, y]) => {
    return [x, y]
  })

  // console.log('format', formatPath)

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
    position.coords.longitude
  )

  naver.maps.Event.once(map, 'init', () => {
    map.setCenter(location)
  })
  // infoMark.open(map, location)
  myMarker(map, position)
}
