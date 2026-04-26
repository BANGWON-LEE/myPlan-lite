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

  const { setCateIndex } = useRoutePlaceIdxStore()

  function setRoutePlaceIdx(list: string, nextIdx: number) {
    switch (list) {
      case 'meal':
        setCateIndex('meal', nextIdx)
        break
      case 'coffee':
        setCateIndex('coffee', nextIdx)
        break
      case 'pharmacy':
        setCateIndex('pharmacy', nextIdx)
        break
      case 'shopping':
        setCateIndex('shopping', nextIdx)
        break
      case 'karaoke':
        setCateIndex('karaoke', nextIdx)
        break
      case 'touristSpot':
        setCateIndex('touristSpot', nextIdx)
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
