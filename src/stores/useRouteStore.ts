import { PositionState } from '@/types/placeType'
import { RouteIdxState } from '@/types/storeType'
import { create } from 'zustand'

export const useRoutePlaceIdxStore = create<RouteIdxState>(set => ({
  idx: 0,
  incIdx: () => set((state: { idx: number }) => ({ idx: state.idx + 1 })),
  initialIdx: () => set((state: { idx: number }) => ({ idx: (state.idx = 0) })),
}))

export const usePositionStore = create<PositionState>(set => ({
  position: null,
  setPosition: pos => set({ position: pos }),
  clearPosition: () => set({ position: null }),
}))
