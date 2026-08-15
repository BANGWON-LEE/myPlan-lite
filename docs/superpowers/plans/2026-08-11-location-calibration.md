# Location Calibration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modular location calibration pipeline for `watchPosition` updates, including a separate movement-mode detection function.

**Architecture:** Add pure TypeScript modules under `src/util/location/calibration/`. `RouteMap.tsx` will keep the watch lifecycle but send each live coordinate through `calibratePosition` before moving the marker.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Naver Maps API.

## Global Constraints

- Keep calibration pure and testable; do not call browser APIs inside calibration modules.
- Default public calibration mode is `auto`.
- `detectMovementMode` must be a separate module.
- Do not change initial route search or fallback permission behavior.
- Write failing Vitest tests before production code.

---

### Task 1: Calibration Core Types And Helpers

**Files:**
- Create: `src/util/location/calibration/types.ts`
- Create: `src/util/location/calibration/geo.ts`
- Test: `src/util/location/calibration/geo.test.ts`

**Interfaces:**
- Produces: `LocationCoordinate`, `LocationSample`, `MovementMode`, `ResolvedMovementMode`, `CalibrationState`, `CalibrationOptions`
- Produces: `getDistanceMeters(from: LocationCoordinate, to: LocationCoordinate): number`
- Produces: `getSpeedMetersPerSecond(previous: LocationSample, current: LocationSample): number | null`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { getDistanceMeters, getSpeedMetersPerSecond } from './geo'
import { LocationSample } from './types'

describe('geo helpers', () => {
  it('calculates distance in meters between two coordinates', () => {
    const distance = getDistanceMeters(
      { latitude: 37.5665, longitude: 126.978 },
      { latitude: 37.56695, longitude: 126.978 },
    )

    expect(distance).toBeGreaterThan(49)
    expect(distance).toBeLessThan(51)
  })

  it('returns calculated speed when timestamps move forward', () => {
    const previous: LocationSample = {
      latitude: 37.5665,
      longitude: 126.978,
      accuracy: 10,
      timestamp: 1000,
    }
    const current: LocationSample = {
      latitude: 37.56695,
      longitude: 126.978,
      accuracy: 10,
      timestamp: 11000,
    }

    const speed = getSpeedMetersPerSecond(previous, current)

    expect(speed).not.toBeNull()
    expect(speed!).toBeGreaterThan(4.9)
    expect(speed!).toBeLessThan(5.1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn vitest src/util/location/calibration/geo.test.ts --run`
Expected: FAIL because `geo.ts` does not exist.

- [ ] **Step 3: Write minimal implementation**

Create the exported types and helper functions using the haversine formula and timestamp delta in seconds.

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn vitest src/util/location/calibration/geo.test.ts --run`
Expected: PASS.

### Task 2: Movement Mode Detection

**Files:**
- Create: `src/util/location/calibration/detectMovementMode.ts`
- Test: `src/util/location/calibration/detectMovementMode.test.ts`

**Interfaces:**
- Consumes: `LocationSample`, `ResolvedMovementMode`, `getSpeedMetersPerSecond`
- Produces: `detectMovementMode(samples: LocationSample[], previousMode?: ResolvedMovementMode): ResolvedMovementMode`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { detectMovementMode } from './detectMovementMode'
import { LocationSample } from './types'

const base: LocationSample = {
  latitude: 37.5665,
  longitude: 126.978,
  accuracy: 10,
  timestamp: 1000,
}

describe('detectMovementMode', () => {
  it('detects walking for slow recent movement', () => {
    const samples = [
      base,
      { ...base, latitude: 37.56659, timestamp: 11000 },
      { ...base, latitude: 37.56668, timestamp: 21000 },
    ]

    expect(detectMovementMode(samples, 'driving')).toBe('walking')
  })

  it('detects driving for fast recent movement', () => {
    const samples = [
      base,
      { ...base, latitude: 37.5674, timestamp: 11000 },
      { ...base, latitude: 37.5683, timestamp: 21000 },
    ]

    expect(detectMovementMode(samples, 'walking')).toBe('driving')
  })

  it('keeps previous mode when speed is ambiguous', () => {
    const samples = [base, { ...base, latitude: 37.56686, timestamp: 11000 }]

    expect(detectMovementMode(samples, 'walking')).toBe('walking')
    expect(detectMovementMode(samples, 'driving')).toBe('driving')
  })

  it('uses browser speed when available and clearly driving', () => {
    const samples = [base, { ...base, speed: 8, timestamp: 2000 }]

    expect(detectMovementMode(samples, 'walking')).toBe('driving')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn vitest src/util/location/calibration/detectMovementMode.test.ts --run`
Expected: FAIL because `detectMovementMode.ts` does not exist.

- [ ] **Step 3: Write minimal implementation**

Average recent calculated speeds, prefer browser speed only when it is at least `5m/s`, return walking below `2.5m/s`, driving above `5m/s`, and previous mode in between.

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn vitest src/util/location/calibration/detectMovementMode.test.ts --run`
Expected: PASS.

### Task 3: Calibration Functions And RouteMap Integration

**Files:**
- Create: `src/util/location/calibration/walkingCalibration.ts`
- Create: `src/util/location/calibration/drivingCalibration.ts`
- Create: `src/util/location/calibration/calibratePosition.ts`
- Create: `src/util/location/calibration/index.ts`
- Test: `src/util/location/calibration/calibratePosition.test.ts`
- Modify: `src/features/route/components/RouteMap.tsx`

**Interfaces:**
- Consumes: `detectMovementMode(samples, previousMode)`
- Produces: `calibratePosition(sample: LocationSample, previousState: CalibrationState | null, options?: CalibrationOptions): { coordinate: LocationCoordinate; state: CalibrationState }`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { calibratePosition } from './calibratePosition'
import { LocationSample } from './types'

const first: LocationSample = {
  latitude: 37.5665,
  longitude: 126.978,
  accuracy: 10,
  timestamp: 1000,
}

describe('calibratePosition', () => {
  it('initializes state from the first sample', () => {
    const result = calibratePosition(first, null)

    expect(result.coordinate).toEqual({
      latitude: first.latitude,
      longitude: first.longitude,
    })
    expect(result.state.resolvedMode).toBe('walking')
    expect(result.state.samples).toHaveLength(1)
  })

  it('dampens a low-accuracy walking jump', () => {
    const initial = calibratePosition(first, null, { mode: 'walking' })
    const jumped: LocationSample = {
      latitude: 37.5678,
      longitude: 126.978,
      accuracy: 120,
      timestamp: 11000,
    }

    const result = calibratePosition(jumped, initial.state, { mode: 'walking' })

    expect(result.coordinate.latitude).toBeGreaterThan(first.latitude)
    expect(result.coordinate.latitude).toBeLessThan(37.567)
    expect(result.state.resolvedMode).toBe('walking')
  })

  it('follows driving movement more quickly than walking', () => {
    const initial = calibratePosition(first, null, { mode: 'driving' })
    const next: LocationSample = {
      latitude: 37.5674,
      longitude: 126.978,
      accuracy: 10,
      timestamp: 11000,
    }

    const walking = calibratePosition(next, initial.state, { mode: 'walking' })
    const driving = calibratePosition(next, initial.state, { mode: 'driving' })

    expect(driving.coordinate.latitude).toBeGreaterThan(walking.coordinate.latitude)
    expect(driving.state.resolvedMode).toBe('driving')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn vitest src/util/location/calibration/calibratePosition.test.ts --run`
Expected: FAIL because `calibratePosition.ts` does not exist.

- [ ] **Step 3: Write minimal implementation**

Implement interpolation-based walking and driving calibration. Keep at most five samples in state. Export public API from `index.ts`.

- [ ] **Step 4: Run calibration tests**

Run: `yarn vitest src/util/location/calibration --run`
Expected: PASS.

- [ ] **Step 5: Integrate RouteMap**

In `RouteMap.tsx`, add a `calibrationStateRef`, convert `watchPosition` values to `LocationSample`, call `calibratePosition(sample, calibrationStateRef.current, { mode: 'auto' })`, save the returned state, and set the marker from the calibrated coordinate.

- [ ] **Step 6: Verify project**

Run: `yarn vitest src/util/location/calibration --run`
Run: `yarn lint`
Expected: PASS.
