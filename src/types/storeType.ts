import { RoutePoint, tmapWalkingRouteResponseType } from './routeType'

export type RouteIdxState = {
  incIdx: () => void
  initialIdx: () => void
  idx: number
}

export type RouteCategoryIdxState = {
  setBankIdx: (value: number) => void
  setHospitalIdx: (value: number) => void
  setPharmacyIdx: (value: number) => void
  setShoppingIdx: (value: number) => void
  setKaraokeIdx: (value: number) => void
  setToiletIdx: (value: number) => void
  initialIdx: () => void
  bankIdx: number
  hospitalIdx: number
  pharmacyIdx: number
  shoppingIdx: number
  karaokeIdx: number
  toiletIdx: number
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
