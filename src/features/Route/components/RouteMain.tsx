'use client'

import { Suspense } from 'react'
import RoutePlace from './RoutePlace'
import LoadingScreen from '@/features/loading/components/LoadingScreen'

export default function RouteMain() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RoutePlace />
    </Suspense>
  )
}
