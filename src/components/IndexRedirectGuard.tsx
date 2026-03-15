'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function IndexRedirectGuard() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === '/') return
    router.replace('/')
  }, [pathname, router])

  return null
}
