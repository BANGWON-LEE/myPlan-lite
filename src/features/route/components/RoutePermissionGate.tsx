'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { POSITION_QUERY_KEY } from '@/lib/queryKeys'

type LocationPermissionState =
  | 'checking'
  | 'granted'
  | 'denied'
  | 'prompt'
  | 'error'

export default function RoutePermissionGate({
  children,
}: {
  children: (position: GeolocationPosition) => React.ReactNode
}) {
  const router = useRouter()
  const [permission, setPermission] =
    useState<LocationPermissionState>('checking')

  const getPosition = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
      )
    })

  const { data: position } = useQuery<GeolocationPosition>({
    queryKey: POSITION_QUERY_KEY,
    queryFn: async () => await getPosition(),
    staleTime: 1000 * 60 * 5,
    enabled: permission === 'granted',
  })

  useEffect(() => {
    let cancelled = false

    async function checkPermission() {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        if (!cancelled) {
          setPermission('error')
        }
        return
      }

      try {
        if (navigator.permissions?.query) {
          const result = await navigator.permissions.query({
            name: 'geolocation',
          })

          if (cancelled) return

          if (result.state === 'denied') {
            setPermission('denied')
          } else {
            setPermission('granted')
          }

          result.onchange = () => {
            if (!cancelled) {
              if (result.state === 'denied') {
                setPermission('denied')
                return
              }

              setPermission('granted')
            }
          }

          return
        }

        setPermission('granted')
      } catch {
        if (!cancelled) {
          setPermission('error')
        }
      }
    }

    checkPermission()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (permission === 'checking' || permission === 'granted') {
      return
    }

    const message =
      permission === 'denied'
        ? '브라우저에서 위치 권한을 허용해주세요.'
        : '위치 정보를 사용할 수 없습니다.'

    window.alert(message)
    router.replace('/')
  }, [permission, router])

  if (permission === 'granted' && position) {
    return <>{children(position)}</>
  }

  return null
}
