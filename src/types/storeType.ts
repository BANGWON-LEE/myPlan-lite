import { tmapWalkingRouteResponseType } from './routeType'

export type RouteIdxState = {
  incIdx: () => void
  initialIdx: () => void
  idx: number
}

export type RouteCategoryIdxState = {
  setMealIdx: (value: number) => void
  setCoffeeIdx: (value: number) => void
  setPharmacyIdx: (value: number) => void
  setShoppingIdx: (value: number) => void
  setKaraokeIdx: (value: number) => void
  setTouristSpotIdx: (value: number) => void
  initialIdx: () => void
  mealIdx: number
  coffeeIdx: number
  pharmacyIdx: number
  shoppingIdx: number
  karaokeIdx: number
  touristSpotIdx: number
}

export type markerState = {
  setLoadingMaker: () => void
  setCompleteMarker: () => void
  state: boolean
}

export type RoutePathState = {
  path: tmapWalkingRouteResponseType | null
  setPath: (path: tmapWalkingRouteResponseType) => void
}
