'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { POSITION_STORAGE_KEY } from '@/data/constant'
import LocationError from '@/features/error/Error'
import { useCurrentPositionQuery } from '@/util/map/query'

type LocationPermissionState = 'checking' | 'granted' | 'error'

export default function RoutePermissionGate({
  children,
}: {
  children: (position: GeolocationPosition) => React.ReactNode
}) {
  const router = useRouter()

  const isGeolocationError = (
    value: unknown,
  ): value is Pick<GeolocationPositionError, 'code'> =>
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof value.code === 'number'

  const getStoredPosition = (): GeolocationPosition | null => {
    if (typeof window === 'undefined') return null

    const raw = localStorage.getItem(POSITION_STORAGE_KEY)
    if (!raw) return null

    try {
      const parsed = JSON.parse(raw) as {
        coords?: { latitude?: number; longitude?: number }
        timestamp?: number
      }

      if (
        typeof parsed?.coords?.latitude !== 'number' ||
        typeof parsed?.coords?.longitude !== 'number' ||
        typeof parsed?.timestamp !== 'number'
      ) {
        return null
      }

      return {
        coords: {
          accuracy: 0,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          latitude: parsed.coords.latitude,
          longitude: parsed.coords.longitude,
          speed: null,
          toJSON: () => parsed.coords as GeolocationCoordinates,
        },
        timestamp: parsed.timestamp,
        toJSON: () => parsed as GeolocationPosition,
      }
    } catch {
      return null
    }
  }

  const storedPosition = getStoredPosition()

  const { data: locationResult, error, isLoading } = useCurrentPositionQuery()
  const position = locationResult?.position

  useEffect(() => {
    if (storedPosition) {
      return
    }

    if (!error) {
      return
    }

    const message =
      isGeolocationError(error) && error.code === 1
        ? '브라우저에서 위치 권한을 허용해주세요.'
        : '위치 정보를 사용할 수 없습니다.'

    window.alert(message)
    router.replace('/')
  }, [error, router, storedPosition])

  const permission: LocationPermissionState = isLoading
    ? 'checking'
    : position || storedPosition
      ? 'granted'
      : 'error'

  const currentPosition = position ?? storedPosition

  if (permission === 'granted' && currentPosition) {
    return <>{children(currentPosition)}</>
  } else if (permission === 'error') {
    return <LocationError />
  }

  return null
}
