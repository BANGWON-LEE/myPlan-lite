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

export function filterApiData(apiArr: Record<string, number>) {
  const placeNameArr = apiArr.searchPoiInfo.pois.poi

  const result = placeNameArr.filter((place: Record<string, string>) => {
    return (
      !place.name.includes('주차장') &&
      !place.name.includes('정문') &&
      !place.name.includes('후문')
    )
  })

  return result
}

export function formatStringToArray(str: string) {
  return str.split(',')
}

export function addValueByCategory(
  setRouteList: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  purpose: string,
  place: string[]
) {
  switch (purpose) {
    case '음식점':
      return setRouteList(prev => ({
        ...prev,
        meal: [...place],
      }))
    case '커피':
      return setRouteList(prev => ({
        ...prev,
        coffee: [...place],
      }))
    case '공원':
      return setRouteList(prev => ({
        ...prev,
        walk: [...place],
      }))
    case '쇼핑':
      return setRouteList(prev => ({
        ...prev,
        shopping: [...place],
      }))
    default:
      null
  }
}
