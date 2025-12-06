'use client'

import LoadingScreen from '@/features/loading/components/LoadingScreen'
import RouteMain from '@/features/Route/components/RouteMain'
import { Suspense } from 'react'

export default function RoutePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouteMain />
    </Suspense>
  )
}
