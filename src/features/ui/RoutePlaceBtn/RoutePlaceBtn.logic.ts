import { useRoutePlaceIdxStore } from '@/stores/useRouteStore'
import { placeType } from '@/types/placeType'
import { useState } from 'react'

export function useRoutePlaceBtn(
  // placeList: placeType[],
  currentIdx: number,
  place: { key: string; list: placeType | null },
  isDisabled: boolean,
) {
  const {
    setBankIdx,
    setHospitalIdx,
    setPharmacyIdx,
    setShoppingIdx,
    setKaraokeIdx,
    setToiletIdx,
  } = useRoutePlaceIdxStore()

  function setRoutePlaceIdx(list: string, nextIdx: number) {
    switch (list) {
      case 'bank':
        setBankIdx(nextIdx)
        break
      case 'hospital':
        setHospitalIdx(nextIdx)
        break
      case 'pharmacy':
        setPharmacyIdx(nextIdx)
        break
      case 'shopping':
        setShoppingIdx(nextIdx)
        break
      case 'karaoke':
        setKaraokeIdx(nextIdx)
        break
      case 'toilet':
        setToiletIdx(nextIdx)
        break
      default:
        break
    }
  }

  function handleSearchOtherPlace() {
    setRoutePlaceIdx(place.key, currentIdx + 1)
  }

  return {
    onClick: () => handleSearchOtherPlace(),
    isDisabled,
  }
}
