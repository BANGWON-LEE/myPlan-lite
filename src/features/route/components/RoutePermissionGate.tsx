'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { POSITION_QUERY_KEY } from '@/lib/queryKeys'

type LocationPermissionState =
  | 'checking'
  | 'granted'
  | 'error'

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

  const getPosition = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
      )
    })

  const {
    data: position,
    error,
    isLoading,
  } = useQuery<GeolocationPosition, Error | GeolocationPositionError>({
    queryKey: POSITION_QUERY_KEY,
    queryFn: async () => await getPosition(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  useEffect(() => {
    if (!error) {
      return
    }

    const message =
      isGeolocationError(error) && error.code === 1
        ? '브라우저에서 위치 권한을 허용해주세요.'
        : '위치 정보를 사용할 수 없습니다.'

    window.alert(message)
    router.replace('/')
  }, [error, router])

  const permission: LocationPermissionState = isLoading
    ? 'checking'
    : position
      ? 'granted'
      : 'error'

  if (permission === 'granted' && position) {
    return <>{children(position)}</>
  }

  return null
}
