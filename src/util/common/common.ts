import { RouteApiDataType, TmapPoiItem } from '@/types/placeType'

export function checkEmptyString(text: string) {
  const textStatus = text === '' || text === null || text === undefined
  if (textStatus) return alert('검색어를 입력해주세요')
}

export const formatMyLocation = (value: number): number => value / 1e7
export const formatTmapPath = (value: number): number => value * 0.00001

export function formatAddressTitle(title: string, charsToRemove: string) {
  const removePattern = new RegExp(`[${charsToRemove}]`, 'g')
  return title.replace(removePattern, '')
}

export function getHourTimeMinTimeFormat(duration: number): {
  hours: number
  minutes: number
} {
  const totalSeconds = Math.floor(duration * 800) //
  const hours = Math.floor(totalSeconds / 3600) // 1시간 = 3600초
  const minutes = Math.ceil((totalSeconds % 3600) / 60) // 남은 초에서 분 계산
  return { hours: hours, minutes: minutes }
}

export function convertGetKm(meter: number): number {
  return Math.round(meter / 1000)
}

export function filterApiData(apiArr: RouteApiDataType[]): TmapPoiItem[][] {
  const placeNameArr = apiArr.map(el => {
    return el.data.searchPoiInfo.pois.poi
  })

  const result = placeNameArr.map(place =>
    place.filter(place => {
      return (
        !place.name.includes('주차장') &&
        !place.name.includes('정문') &&
        !place.name.includes('후문')
      )
    })
  )

  return result
}

export function formatResult(
  purposesArr: string[],
  filterApiArr: TmapPoiItem[][]
) {
  const formatResult = purposesArr.reduce((acc, purpose, idx) => {
    acc[purpose] = filterApiArr[idx] // 각 purpose 키에 맞게 응답 매핑

    return acc
  }, {} as Record<string, TmapPoiItem[]>)

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
  purposeArr: string[],
  placeArr: Record<string, TmapPoiItem[]>
) {
  Object.keys(placeArr).map(cateName => {
    // console.log('cateNAme', cateName)

    switch (cateName) {
      case '음식점':
        return (listArr.meal = placeArr[cateName])
      case '커피':
        return (listArr.coffee = placeArr[cateName])
      case '공원':
        return (listArr.walk = placeArr[cateName])
      case '쇼핑':
        return (listArr.shopping = placeArr[cateName])
      default:
        null
    }
  })
  // console.log('listArr', listArr)
  return listArr
}
