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

  it('returns null when timestamps do not move forward', () => {
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
      timestamp: 1000,
    }

    expect(getSpeedMetersPerSecond(previous, current)).toBeNull()
  })
})
