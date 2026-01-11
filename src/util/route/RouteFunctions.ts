const stayTimeByPurpose: Record<string, number> = {
  meal: 40, // 식사
  coffee: 60, // 카페
  lanchCoffee: 25, // 카페에서 식사
  takeoutCoffee: 10, // 카페 테이크아웃 기준
  walk: 10, // 산책
  longWalk: 20, // 긴 산책
  shopping: 20, // 휴식
}

export function calculateRadius(time: string, purpose: string): number {
  const WALK_SPEED_KM_PER_MIN = 0.066 // 평균 도보 속도: 4.5km/h

  const stayTime = stayTimeByPurpose[purpose] ?? 10 // default 10분
  const movingTime = Number(time) - stayTime

  if (movingTime <= 0) return 50 // 체류시간이 전체 시간을 넘으면 최소 반경

  const oneWayTime = movingTime / 2 // 왕복 고려하여 편도 시간 계산
  const distanceKm = oneWayTime * WALK_SPEED_KM_PER_MIN
  const radiusM = Math.floor(distanceKm * 1000)

  return Math.max(radiusM, 80) // 최소 80m는 확보
}

export function reFormatPurposes(purposes: string[]): string[] {
  // 커피랑 산책로가 함께 응답으로 오면 커피는 takeoutCoffee로 변경 산책도 longWalk로 변경
  // 현재 시간 값을 구해서 점심일 경우 즉 오후 11시 30분 ~ 13시 30분일 경우
  // 음식점과 커피 함께 있으면 커피는 lanchCoffee로 변경
  // purposes 배열이 유지 된 상태에서 값이 바뀌어야 함

  //   const currentTimeType = getCurrentTimeType()
  const newPurposes = [...purposes]

  if (purposes.includes('커피') && purposes.includes('산책로')) {
    const coffeeIndex = newPurposes.indexOf('커피')
    const walkIndex = newPurposes.indexOf('산책로')
    newPurposes[coffeeIndex] = 'takeoutCoffee'
    newPurposes[walkIndex] = 'longWalk'
  }
  return newPurposes
}
// 현재 시간 값을 구해서 점심일 경우 즉 오후 11시 30분 ~ 13시 30분일 경우 지금은 lanunch라는 문자열을 리턴하고
// 오후 17시 이후 즉, 저녁 시간일 경우 dinner라는 문자열을 리턴하고
// 그 외의 시간일 경우 normal이라는 문자열을 리턴해주는 함수

export function getCurrentTimeType(): string {
  const now = new Date().getTime()

  const nowIsLaunchStart = timeToMs(11, 30)
  const nowIsLaunchEnd = timeToMs(13, 30)
  const nowIsDinnerStart = timeToMs(17, 0)

  switch (true) {
    case now >= nowIsLaunchStart && now <= nowIsLaunchEnd:
      return 'lunch'
    case now >= nowIsDinnerStart:
      return 'dinner'
    default:
      return 'normal'
  }
}

function timeToMs(hour: number, minute: number) {
  // 현재 시간의 밀리세컨드 구하기 위한 함수
  return hour * 60 * 60 * 1000 + minute * 60 * 1000
}

export function tMapFormatSpreadPath(path: number[]) {
  const resultArr: number[] = []

  path.forEach(el => {
    if (Array.isArray(el) && Array.isArray(el[0])) {
      resultArr.push(...el)
    } else if (!Array.isArray(el)) {
      resultArr.push(el)
    }
  })

  return resultArr
}
