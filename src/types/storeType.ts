export type RouteIdxState = {
  incIdx: () => void
  initialIdx: () => void
  idx: number
}

export type markerState = {
  setLoadingMaker: () => void
  setCompleteMarker: () => void
  state: boolean
}
