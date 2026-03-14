import { placeType } from '@/types/placeType'

type RoutePlaceBottomState = {
  place: { key: string; list: placeType | null }
  placeList: placeType[]
  currentIdx: number
  isDisabled: boolean
}

function getRoutePlaceBottomState({
  placeList,
  currentIdx,
  isDisabled,
}: RoutePlaceBottomState) {
  const hasNoMorePlaces = placeList.length === 0 || currentIdx + 1 >= placeList.length

  return {
    hasNoMorePlaces,
    isSearchButtonDisabled: isDisabled || hasNoMorePlaces,
    errorMessage: hasNoMorePlaces
      ? '다른 장소를 불러오지 못했습니다.'
      : '',
  }
}

function changeRoutePlaceIdx(list: string) {
  return list
}

function moveRoutePlaceIdx(list: string, stepCount: number) {
  for (let i = 0; i < stepCount; i += 1) {
    changeRoutePlaceIdx(list)
  }
}

function toggleDisabled(state: boolean) {
  return state
}

async function drawMarker(
  lat: number,
  lon: number,
  placeName: string | undefined,
) {
  return {
    lat,
    lon,
    placeName,
  }
}

async function handleSearchOtherPlace({
  place,
  placeList,
  currentIdx,
  isDisabled,
}: RoutePlaceBottomState) {
  const { hasNoMorePlaces } = getRoutePlaceBottomState({
    place,
    placeList,
    currentIdx,
    isDisabled,
  })

  if (hasNoMorePlaces) {
    return {
      errorMessage: '다른 장소를 불러오지 못했습니다.',
    }
  }

  for (let nextIdx = currentIdx + 1; nextIdx < placeList.length; nextIdx += 1) {
    const nextPlace = placeList[nextIdx]
    if (!nextPlace) continue

    try {
      await drawMarker(
        Number(nextPlace.pnsLat),
        Number(nextPlace.pnsLon),
        nextPlace.name,
      )

      moveRoutePlaceIdx(place.key, nextIdx - currentIdx)

      return {
        nextPlaceName: nextPlace.name,
        errorMessage: '',
      }
    } catch {
      toggleDisabled(false)
    }
  }

  return {
    errorMessage: '다른 장소를 불러오지 못했습니다.',
  }
}

export {
  getRoutePlaceBottomState,
  handleSearchOtherPlace,
}
