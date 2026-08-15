import { calibrateDrivingPosition } from './drivingCalibration'
import { calibrateWalkingPosition } from './walkingCalibration'
import { detectMovementMode } from './detectMovementMode'
import {
  CalibrationOptions,
  CalibrationResult,
  CalibrationState,
  LocationSample,
  ResolvedMovementMode,
} from './types'

const MAX_SAMPLE_HISTORY = 5
const DEFAULT_MODE: ResolvedMovementMode = 'walking'

// 첫 샘플은 비교할 이전 좌표가 없으므로 원본 좌표를 그대로 기준점으로 삼는다.
function initialCalibrationState(
  sample: LocationSample,
  mode: CalibrationOptions['mode'],
  movementModeSamples: LocationSample[],
) {
  const resolvedMode =
    mode === 'auto' ? DEFAULT_MODE : (mode as ResolvedMovementMode)
  const coordinate = {
    latitude: sample.latitude,
    longitude: sample.longitude,
  }

  return {
    coordinate,
    state: {
      coordinate,
      resolvedMode,
      movementModeSamples,
    },
  }
}

export function calibratePosition(
  position: LocationSample,
  previousState: CalibrationState | null,
  { mode = 'auto' }: CalibrationOptions = {},
): CalibrationResult {
  // 최근 샘플만 유지해 모드 판정은 안정화하되 오래된 이동 패턴은 빠르게 버린다.
  const movementModeSamples = [
    ...(previousState?.movementModeSamples ?? []),
    position,
  ].slice(-MAX_SAMPLE_HISTORY)

  if (!previousState)
    return initialCalibrationState(position, mode, movementModeSamples)

  const resolvedMovementMode =
    mode === 'auto'
      ? detectMovementMode(movementModeSamples, previousState.resolvedMode)
      : (mode as ResolvedMovementMode)

  // 도보는 흔들림을 더 강하게 줄이고, 주행은 실제 이동을 덜 늦추도록 다른 보정값을 쓴다.
  const coordinate =
    resolvedMovementMode === 'driving'
      ? calibrateDrivingPosition(position, previousState.coordinate)
      : calibrateWalkingPosition(position, previousState.coordinate)

  return {
    coordinate,
    state: {
      coordinate,
      resolvedMode: resolvedMovementMode,
      movementModeSamples,
    },
  }
}
