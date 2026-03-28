import { useRoutePlaceIdxStore } from '@/stores/useRouteStore'
import { placeType } from '@/types/placeType'
import { useState } from 'react'

export default function RoutePlaceBottom(props: {
  place: { key: string; list: placeType | null }
  placeList: placeType[]
  currentIdx: number
  isDisabled: boolean
  onSearchOtherPlace: () => void
}) {
  const { currentIdx, isDisabled, onSearchOtherPlace, place, placeList } = props
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

  async function handleSearchOtherPlace() {
    if (hasNoMorePlaces) {
      setSearchErrorMessage('불러올 장소가 없습니다.')
      return
    }

    setSearchErrorMessage('')
    onSearchOtherPlace()
    setRoutePlaceIdx(place.key, currentIdx + 1)
  }

  return (
    <div className="w-1/4 grid">
      <button
        className="h-full w-full bg-amber-200"
        disabled={isDisabled}
        onClick={() => {
          handleSearchOtherPlace()
        }}
      >
        <div
          className={`px-3 py-2 font-semibold ${searchErrorMessage ? 'text-red-500' : 'text-amber-600'}`}
        >
          {searchErrorMessage ? searchErrorMessage : '다른 장소 검색'}
        </div>
      </button>
    </div>
  )
}
