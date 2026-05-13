import { useRoutePlaceIdxStore } from '@/stores/useRouteStore'
import { placeType } from '@/types/placeType'

export function useRoutePlaceBtn(
  index: number,
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
    setRoutePlaceIdx(place.key, index)
  }

  return {
    onClick: () => handleSearchOtherPlace(),
    isDisabled,
  }
}
