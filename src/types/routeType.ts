import { MapScriptProps, TmapPoiItem, TmapPoiResponse } from '@/types/placeType'

export type TmapCoordinate = [number, number]

export interface tmapResponseWalk {
  geometry: {
    type: string
    coordinates: TmapCoordinate
  }
}

export type tmapDistanceType = {
  properties: {
    description: string
    index: number
    name: string
    nextRoadName: string
    pointIndex: number
    pointType: string
    taxiFare: number
    totalDistance: number
    totalFare: number
    totalTime: number
    turnType: number
  }
}

export type tmapRoutePathType = TmapCoordinate[]

export type tmapWalkingRouteResponseType = {
  path: tmapRoutePathType[]
  summary: tmapDistanceType[][]
}

export type RouteCategoryKey =
  | 'bank'
  | 'hospital'
  | 'pharmacy'
  | 'shopping'
  | 'karaoke'
  | 'toilet'

export type RoutePoint = {
  x: number
  y: number
  name: string
}

export type walkDataType = {
  startPoint: RoutePoint
  routePoints: RoutePoint[]
}

export type SearchLocResponse = {
  searchPoiInfo: TmapPoiResponse
}

// export type startInfoType = {
//   start: {
//     name: string
//     path: { x: number; y: number }
//     address: string
//     roadAddress: string
//     category: string
//   }
// }

export type startRouteType = {
  x: number
  y: number
}

export type goalRouteType = {
  x: number
  y: number
}

export type startInfoType = {
  start: {
    name: string
    path: { x: number; y: number }
    address: string
    roadAddress: string
    category: string
  }
}

export type infoType = {
  name: number
  start: {
    name: string
    path: { x: number; y: number }
    address: string
    roadAddress: string
    category: string
  }
}

export type goalInfoType = {
  goal: {
    name: string
    path: { x: number; y: number }
    address: string
    roadAddress: string
    category: string
  }
}

export type StoredPosition = {
  coords: {
    latitude: number
    longitude: number
  }
  timestamp: number
}

export type RouteMapProps = MapScriptProps & {
  routeList: Record<RouteCategoryKey, TmapPoiItem[]>
  selectedRoutePoints: RoutePoint[]
  queryPurposes: string
}

export type WalkingApiType = {
  startX: number
  startY: number
  endX: number
  endY: number
  reqCoordType: string
  resCoordType: string
  startName: string
  endName: string
}

export type WalkApiResType = {
  polylines: naver.maps.Polyline[]
  markers: naver.maps.Marker[]
}
export interface WalkQueryType extends WalkDrawArgType {
  routeList: Record<RouteCategoryKey, TmapPoiItem[]>
  isStartPositionChanged: boolean
}

export interface WalkArgType extends WalkDrawArgType {
  map: naver.maps.Map
}

export interface WalkDrawArgType {
  selectedRoutePoints: RoutePoint[]
  // routeList: Record<RouteCategoryKey, TmapPoiItem[]>
  // getStartPosition: () => RoutePoint
  getStartPosition: RoutePoint
}
