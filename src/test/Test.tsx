import { placeType } from '@/types/placeType'

type RoutePlaceBottomSnippetState = {
  place: { key: string; list: placeType | null }
  placeList: placeType[]
  currentIdx: number
  isDisabled: boolean
}

type RoutePlaceBottomViewState = {
  hasNoMorePlaces: boolean
  isSearchButtonDisabled: boolean
  errorMessage: string
}

type SearchOtherPlaceResult =
  | {
      nextPlaceName: string
      errorMessage: ''
    }
  | {
      nextPlaceName?: undefined
      errorMessage: string
    }

function getRoutePlaceBottomState({
  placeList,
  currentIdx,
  isDisabled,
}: RoutePlaceBottomSnippetState): RoutePlaceBottomViewState {
  const hasNoMorePlaces =
    placeList.length === 0 || currentIdx + 1 >= placeList.length

  return {
    hasNoMorePlaces,
    isSearchButtonDisabled: isDisabled,
    errorMessage: '',
  }
}

function setRoutePlaceIdx(list: string, nextIdx: number): { list: string; nextIdx: number } {
  return { list, nextIdx }
}

function toggleDisabled(state: boolean): boolean {
  return state
}

async function drawMarker(
  lat: number,
  lon: number,
  placeName: string | undefined,
): Promise<{ lat: number; lon: number; placeName: string | undefined }> {
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
}: RoutePlaceBottomSnippetState): Promise<SearchOtherPlaceResult> {
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

  for (const [offset, nextPlace] of placeList.slice(currentIdx + 1).entries()) {
    if (!nextPlace) continue

    try {
      await drawMarker(
        Number(nextPlace.pnsLat),
        Number(nextPlace.pnsLon),
        nextPlace.name,
      )

      setRoutePlaceIdx(place.key, currentIdx + offset + 1)

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

export default function Test() {
  return null
}

export {
  getRoutePlaceBottomState,
  handleSearchOtherPlace,
}
