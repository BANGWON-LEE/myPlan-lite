import { PositionState } from '@/types/placeType'
import {
  CurrentPosiMarkerState,
  MapState,
  MapReadyState,
  markerState,
  RouteCategoryIdxState,
  RoutePathState,
  StartPointState,
} from '@/types/storeType'
import { create } from 'zustand'

//장소 전체를 인덱스 증가
// export const useRoutePlaceIdxStore = create<RouteIdxState>(set => ({
//   idx: 0,
//   incIdx: () => set((state: { idx: number }) => ({ idx: state.idx + 1 })),
//   initialIdx: () => set((state: { idx: number }) => ({ idx: (state.idx = 0) })),
// }))

export const useRoutePlaceIdxStore = create<RouteCategoryIdxState>(set => ({
  bankIdx: 0,
  hospitalIdx: 0,
  pharmacyIdx: 0,
  shoppingIdx: 0,
  karaokeIdx: 0,
  toiletIdx: 0,
  setBankIdx: value => set({ bankIdx: value }),
  setHospitalIdx: value => set({ hospitalIdx: value }),
  setPharmacyIdx: value => set({ pharmacyIdx: value }),
  setShoppingIdx: value => set({ shoppingIdx: value }),
  setKaraokeIdx: value => set({ karaokeIdx: value }),
  setToiletIdx: value => set({ toiletIdx: value }),
  initialIdx: () =>
    set({
      bankIdx: 0,
      hospitalIdx: 0,
      pharmacyIdx: 0,
      shoppingIdx: 0,
      karaokeIdx: 0,
      toiletIdx: 0,
    }),
}))

export const usePositionStore = create<PositionState>(set => ({
  position: null,
  setPosition: pos => set({ position: pos }),
  clearPosition: () => set({ position: null }),
}))

export const useLoadingMarkerStore = create<markerState>(set => ({
  state: false,
  setLoadingMaker: () => set({ state: true }),
  setCompleteMarker: () => set({ state: false }),
}))

export const useRoutePathStore = create<RoutePathState>(set => ({
  path: null,
  setPath: path => set({ path }),
}))

export const useStartPointStore = create<StartPointState>(set => ({
  startPoint: null,
  setStartPoint: startPoint => set({ startPoint }),
}))

export const useMapReadyStore = create<MapReadyState>(set => ({
  isMapReady: false,
  setIsMapReady: isMapReady => set({ isMapReady }),
}))

export const useMapStore = create<MapState>(set => ({
  map: null,
  setMap: map => set({ map }),
}))

export const useCurrentPosiMarkerStore = create<CurrentPosiMarkerState>(
  set => ({
    currentPosiMarker: null,
    setCurrentPosiMarker: currentPosiMarker => set({ currentPosiMarker }),
  }),
)
