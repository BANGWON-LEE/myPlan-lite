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
    expect(result.state.movementModeSamples).toHaveLength(1)
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

    expect(driving.coordinate.latitude).toBeGreaterThan(
      walking.coordinate.latitude,
    )
    expect(driving.state.resolvedMode).toBe('driving')
  })

  it('auto mode stores the detected resolved mode', () => {
    const initial = calibratePosition(first, null)
    const fast: LocationSample = {
      latitude: 37.5674,
      longitude: 126.978,
      accuracy: 10,
      timestamp: 11000,
    }

    const result = calibratePosition(fast, initial.state, { mode: 'auto' })

    expect(result.state.resolvedMode).toBe('driving')
  })
})
