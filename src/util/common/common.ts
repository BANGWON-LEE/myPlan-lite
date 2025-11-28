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
  const totalSeconds = Math.floor(duration / 1000)
  const hours = Math.floor(totalSeconds / 3600) // 1시간 = 3600초
  const minutes = Math.floor((totalSeconds % 3600) / 60) // 남은 초에서 분 계산
  return { hours: hours, minutes: minutes }
}

export function convertGetKm(meter: number): number {
  return Math.round(meter / 1000)
}
