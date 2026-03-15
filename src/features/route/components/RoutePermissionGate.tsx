'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type LocationPermissionState =
  | 'checking'
  | 'granted'
  | 'denied'
  | 'prompt'
  | 'error'

export default function RoutePermissionGate({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const [permission, setPermission] =
    useState<LocationPermissionState>('checking')

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

          setPermission(result.state as LocationPermissionState)

          result.onchange = () => {
            if (!cancelled) {
              setPermission(result.state as LocationPermissionState)
            }
          }

          return
        }

        navigator.geolocation.getCurrentPosition(
          () => {
            if (!cancelled) {
              setPermission('granted')
            }
          },
          () => {
            if (!cancelled) {
              setPermission('denied')
            }
          },
        )
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
    if (permission === 'checking' || permission === 'granted') return

    const message =
      permission === 'prompt'
        ? '위치 권한을 허용하면 경로를 볼 수 있습니다.'
        : permission === 'denied'
          ? '브라우저에서 위치 권한을 허용해주세요.'
          : '위치 정보를 사용할 수 없습니다.'

    window.alert(message)
    router.replace('/')
  }, [permission, router])

  if (permission === 'granted') {
    return <>{children}</>
  }

  return null
}
