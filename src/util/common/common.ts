import { AVERAGE_WALKING_SPEED_METERS_PER_SECOND } from '@/data/constant'
import { RouteApiDataType, TmapPoiItem } from '@/types/placeType'

export function checkEmptyString(text: string) {
  const textStatus = text === '' || text === null || text === undefined
  if (textStatus) return alert('검색어를 입력해주세요')
}

export function handleMissingQueryPurposes() {
  if (typeof window === 'undefined') return

  alert('목적을 다시 선택해주세요.')
  window.history.back()
}

export const formatMyLocation = (value: number): number => value / 1e7
export const formatTmapPath = (value: number): number => value * 0.00001

export function formatAddressTitle(title: string, charsToRemove: string) {
  const removePattern = new RegExp(`[${charsToRemove}]`, 'g')
  return title.replace(removePattern, '')
}

export function getHourTimeMinTimeFormat(distanceMeter: number): {
  hours: number
  minutes: number
} {
  const totalSeconds = Math.ceil(
    distanceMeter / AVERAGE_WALKING_SPEED_METERS_PER_SECOND,
  )
  const totalMinutes = Math.ceil(totalSeconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return { hours, minutes }
}

export function convertGetKm(meter: number): number {
  return Math.round(meter / 1000)
}

export function filterPlaceList(places: TmapPoiItem[]) {
  return places.filter(place => {
    return (
      !place.name.includes('주차장') &&
      !place.name.includes('정문') &&
      !place.name.includes('후문')
    )
  })
}

// 장소 데이터 중, 불필요한 데이터를 필터링 처리하는 함수
export function filterApiData(
  data: RouteApiDataType[] | undefined,
): TmapPoiItem[][] {
  if (data === undefined) return []
  const placeNameArr = data.map(el => {
    return el.data.searchPoiInfo.pois.poi
  })

  // 주차장 및 정문, 후문이 포함된 장소는 필터링 처리
  const result = placeNameArr.map(filterPlaceList)

  return result
}

export function formatResult(
  purposesArr: string[],
  filterApiArr: TmapPoiItem[][],
) {
  const formatResult = purposesArr.reduce(
    (acc, purpose, idx) => {
      acc[purpose] = filterApiArr[idx] // 각 purpose 키에 맞게 응답 매핑

      return acc
    },
    {} as Record<string, TmapPoiItem[]>,
  )

  // console.log('formatResult', formatResult)
  return formatResult
}

export function formatStringToArray(str: string) {
  return str.split(',')
}

export function addValueByCategory(
  // setRouteList: React.Dispatch<
  //   React.SetStateAction<Record<string, TmapPoiItem[]>>
  // >,
  listArr: Record<string, TmapPoiItem[]>,
  // purposeArr: string[],
  placeArr: Record<string, TmapPoiItem[]>,
) {
  Object.keys(placeArr).forEach(cateName => {
    // console.log('cateNAme', cateName)

    switch (cateName) {
      case '음식점':
        return (listArr.meal = placeArr[cateName])
      case '커피':
        return (listArr.coffee = placeArr[cateName])
      case '약국':
        return (listArr.pharmacy = placeArr[cateName])
      case '편의점':
        return (listArr.shopping = placeArr[cateName])
      case '노래방':
        return (listArr.karaoke = placeArr[cateName])
      case '관광지':
        return (listArr.touristSpot = placeArr[cateName])
      default:
        return
    }
  })
  // console.log('listArr', listArr)
  // return listArr
}
