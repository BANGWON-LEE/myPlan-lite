import { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios'
import { RouteCategoryKey, RoutePoint } from './routeType'

export type placeType = {
  name: string
  middleBizName: string
  telNo: string
  radius: string
  newAddressList: {
    newAddress: {
      fullAddressRoad: string
    }[]
  }
  pnsLat: string
  pnsLon: string
}

export interface TmapPoiItem extends placeType {
  id: string
  pkey: string
  navSeq: string
  collectionType: string
  name: string
  frontLat?: string
  frontLon?: string
  noorLat?: string
  noorLon?: string
  upperAddrName?: string
  middleAddrName?: string
  lowerAddrName?: string
  detailAddrName?: string
  mlClass?: string
  radius: string
}

export interface TmapPoiResponse {
  count: string
  page: string
  totalCount: string
  pois: {
    poi: TmapPoiItem[]
  }
}

export type PlaceApiDataType = AxiosResponse<{
  // data: {
  searchPoiInfo: TmapPoiResponse
  // }
  status: number
  statusText: string
  headers: AxiosHeaders
  config: AxiosRequestConfig
  request: XMLHttpRequest
}>

export type RoutePlaceType = {
  routeArr: placeType[]
}

export type PositionType = {
  coords: {
    latitude: number
    longitude: number
  }
}

// export interface GeolocationPositionType {
//   coords: GeolocationCoordinates
//   timestamp: number
// }

export type MapScriptProps = {
  position: GeolocationPosition
}

export type PositionState = {
  position: GeolocationPosition | null
  setPosition: (pos: GeolocationPosition) => void
  clearPosition: () => void
}

export type RoutePlaceProps = MapScriptProps & {
  routeList: Record<RouteCategoryKey, TmapPoiItem[]>
  setRouteList: React.Dispatch<
    React.SetStateAction<Record<RouteCategoryKey, TmapPoiItem[]>>
  >
  routePlaceIndexes: Record<RouteCategoryKey, number>
  selectedRoutePoints: RoutePoint[]
}

export type PlaceArgType = {
  position: GeolocationPosition | null
  queryPurposes: string
  queryTime: string
}
