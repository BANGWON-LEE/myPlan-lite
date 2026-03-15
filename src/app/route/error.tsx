'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RouteError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Route page error:', error)
    window.alert('오류가 발생해 처음 화면으로 이동합니다.')
    router.replace('/')
  }, [error, router])

  return null
}
