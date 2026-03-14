import { PositionState } from '@/types/placeType'
import {
  markerState,
  RouteCategoryIdxState,
  RoutePathState,
} from '@/types/storeType'
import { create } from 'zustand'

//장소 전체를 인덱스 증가
// export const useRoutePlaceIdxStore = create<RouteIdxState>(set => ({
//   idx: 0,
//   incIdx: () => set((state: { idx: number }) => ({ idx: state.idx + 1 })),
//   initialIdx: () => set((state: { idx: number }) => ({ idx: (state.idx = 0) })),
// }))

export const useRoutePlaceIdxStore = create<RouteCategoryIdxState>(set => ({
  mealIdx: 0,
  coffeeIdx: 0,
  pharmacyIdx: 0,
  shoppingIdx: 0,
  karaokeIdx: 0,
  touristSpotIdx: 0,
  setMealIdx: value => set({ mealIdx: value }),
  setCoffeeIdx: value => set({ coffeeIdx: value }),
  setPharmacyIdx: value => set({ pharmacyIdx: value }),
  setShoppingIdx: value => set({ shoppingIdx: value }),
  setKaraokeIdx: value => set({ karaokeIdx: value }),
  setTouristSpotIdx: value => set({ touristSpotIdx: value }),
  initialIdx: () =>
    set({
      mealIdx: 0,
      coffeeIdx: 0,
      pharmacyIdx: 0,
      shoppingIdx: 0,
      karaokeIdx: 0,
      touristSpotIdx: 0,
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
