import { PositionState } from '@/types/placeType'
import {
  markerState,
  RouteCategoryIdxState,
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
  incMealIdx: () =>
    set((state: { mealIdx: number }) => ({ mealIdx: state.mealIdx + 1 })),
  incCoffeeIdx: () =>
    set((state: { coffeeIdx: number }) => ({ coffeeIdx: state.coffeeIdx + 1 })),
  incPharmacyIdx: () =>
    set((state: { pharmacyIdx: number }) => ({
      pharmacyIdx: state.pharmacyIdx + 1,
    })),
  incShoppingIdx: () =>
    set((state: { shoppingIdx: number }) => ({
      shoppingIdx: state.shoppingIdx + 1,
    })),
  initialIdx: () =>
    set({
      mealIdx: 0,
      coffeeIdx: 0,
      pharmacyIdx: 0,
      shoppingIdx: 0,
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
