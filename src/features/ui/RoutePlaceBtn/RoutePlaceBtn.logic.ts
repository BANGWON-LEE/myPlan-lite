import { useRoutePlaceIdxStore } from '@/stores/useRouteStore'
import { placeType } from '@/types/placeType'
import { useState } from 'react'

export function useRoutePlaceBtn(
  placeList: placeType[],
  currentIdx: number,
  place: { key: string; list: placeType | null },
  isDisabled: boolean,
) {
  const [searchErrorMessage, setSearchErrorMessage] = useState('')
  const hasNoMorePlaces =
    placeList.length === 0 || currentIdx + 1 >= placeList.length

  const {
    setMealIdx,
    setCoffeeIdx,
    setPharmacyIdx,
    setShoppingIdx,
    setKaraokeIdx,
    setTouristSpotIdx,
  } = useRoutePlaceIdxStore()

  function setRoutePlaceIdx(list: string, nextIdx: number) {
    switch (list) {
      case 'meal':
        setMealIdx(nextIdx)
        break
      case 'coffee':
        setCoffeeIdx(nextIdx)
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
      case 'touristSpot':
        setTouristSpotIdx(nextIdx)
        break
      default:
        break
    }
  }

  function handleSearchOtherPlace() {
    if (hasNoMorePlaces) {
      setSearchErrorMessage('불러올 장소가 없습니다.')
      return
    }

    setSearchErrorMessage('')
    setRoutePlaceIdx(place.key, currentIdx + 1)
  }

  return {
    searchErrorMessage,
    onClick: () => handleSearchOtherPlace(),
    isDisabled,
  }
}
