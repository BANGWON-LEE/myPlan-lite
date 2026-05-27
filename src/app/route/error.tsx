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
    window.alert(
      '움직이는 차안이나 해외에서는 해당 서비스를 이용하기 어렵습니다',
    )
    router.replace('/')
  }, [error, router])

  return null
}
