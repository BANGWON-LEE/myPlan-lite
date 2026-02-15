export type RouteIdxState = {
  incIdx: () => void
  initialIdx: () => void
  idx: number
}

export type RouteCategoryIdxState = {
  incMealIdx: () => void
  incCoffeeIdx: () => void
  incPharmacyIdx: () => void
  incShoppingIdx: () => void
  initialIdx: () => void
  mealIdx: number
  coffeeIdx: number
  pharmacyIdx: number
  shoppingIdx: number
}

export type markerState = {
  setLoadingMaker: () => void
  setCompleteMarker: () => void
  state: boolean
}
