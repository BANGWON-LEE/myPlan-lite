import { getSpeedMetersPerSecond } from './geo'
import { LocationSample, ResolvedMovementMode } from './types'

const WALKING_SPEED_MAX_MPS = 2.5
const DRIVING_SPEED_MIN_MPS = 5
const DEFAULT_MODE: ResolvedMovementMode = 'walking'
const RECENT_SAMPLE_LIMIT = 5

export function detectMovementMode(
  movementModeSamples: LocationSample[],
  previousMode: ResolvedMovementMode = DEFAULT_MODE,
): ResolvedMovementMode {
  // 최근 이동만 모드 판정에 반영해서 정지 후 재출발 같은 변화에 빠르게 반응한다.
  const recentMovementModeSamples =
    movementModeSamples.slice(-RECENT_SAMPLE_LIMIT)

  const browserSpeeds = recentMovementModeSamples
    .map(sample => sample.speed)
    .filter((speed): speed is number => typeof speed === 'number')

  const averageSpeed = getAverageSpeed(recentMovementModeSamples)

  // 기기가 직접 제공한 속도는 좌표 간 거리 계산보다 신뢰도가 높을 수 있어 먼저 사용한다.
  if (browserSpeeds.some(speed => speed >= DRIVING_SPEED_MIN_MPS)) {
    return 'driving'
  }

  if (averageSpeed < WALKING_SPEED_MAX_MPS) return 'walking'
  if (averageSpeed > DRIVING_SPEED_MIN_MPS) return 'driving'

  // 애매한 속도 구간에서는 모드가 자주 흔들리지 않도록 직전 판정을 유지한다.
  return previousMode
}

function getAverageSpeed(recentMovementModeSamples: LocationSample[]): number {
  // speed 값이 없거나 일부만 있을 때는 좌표 변화량과 시간 차이로 보조 속도를 계산한다.
  const calculatedSpeeds = recentMovementModeSamples
    .slice(1)
    .map((sample, index) =>
      getSpeedMetersPerSecond(recentMovementModeSamples[index], sample),
    )
    .filter((speed): speed is number => speed !== null)

  // if (calculatedSpeeds.length === 0) return previousMode

  const averageSpeed =
    calculatedSpeeds.reduce((sum, speed) => sum + speed, 0) /
    calculatedSpeeds.length

  return averageSpeed
}
