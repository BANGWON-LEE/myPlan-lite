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
  it('리팩토링한 detetMovementMode가 이전 모드와 최근 샘플을 기반으로 이동 모드를 올바르게 판정하는지 테스트', () => {
    const movementModeSamples = [
      {
        latitude: 37.0,
        longitude: 127.0,
        timestamp: 1000,
      },
    ]

    const result = detectMovementMode(movementModeSamples, 'driving')

    console.log('Detected movement mode:', result) // 디버깅용 로그

    expect(result).toBe('driving')
  })

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

  it('keeps previous mode for low accuracy ambiguous updates', () => {
    const samples = [
      base,
      { ...base, latitude: 37.56686, accuracy: 120, timestamp: 11000 },
    ]

    expect(detectMovementMode(samples, 'driving')).toBe('driving')
  })
})
