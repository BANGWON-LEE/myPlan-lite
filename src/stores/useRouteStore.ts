import { RouteIdxState } from '@/types/storeType'
import { create } from 'zustand'

export const useRoutePlaceIdxStore = create<RouteIdxState>(set => ({
  idx: 0,
  incIdx: () => set((state: { idx: number }) => ({ idx: state.idx + 1 })),
  initialIdx: () => set((state: { idx: number }) => ({ idx: (state.idx = 0) })),
}))
