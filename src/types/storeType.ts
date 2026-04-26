import { Route } from 'next'
import { RoutePoint, tmapWalkingRouteResponseType } from './routeType'

export type RouteIdxState = {
  incIdx: () => void
  initialIdx: () => void
  idx: number
}

type RouteCategoryKey =
  | 'meal'
  | 'coffee'
  | 'pharmacy'
  | 'shopping'
  | 'karaoke'
  | 'touristSpot'

export type RouteCategoryIdxState = {
  cateIndex: Record<RouteCategoryKey, number>
  setCateIndex: (key: RouteCategoryKey, value: number) => void
  resetAllCateIndex: () => void
}

export type markerState = {
  setLoadingMaker: () => void
  setCompleteMarker: () => void
  state: boolean
}

export type RoutePathState = {
  path: tmapWalkingRouteResponseType | null
  setPath: (path: tmapWalkingRouteResponseType | null) => void
}

export type StartPointState = {
  startPoint: RoutePoint | null
  setStartPoint: (startPoint: RoutePoint | null) => void
}

export type MapReadyState = {
  isMapReady: boolean
  setIsMapReady: (isMapReady: boolean) => void
}

export type MapState = {
  map: naver.maps.Map | null
  setMap: (map: naver.maps.Map | null) => void
}

export type CurrentPosiMarkerState = {
  currentPosiMarker: naver.maps.Marker | null
  setCurrentPosiMarker: (currentPosiMarker: naver.maps.Marker | null) => void
}
