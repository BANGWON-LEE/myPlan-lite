'use client'

import { Suspense } from 'react'
// import RoutePlace from './RoutePlace'
import LoadingScreen from '@/features/loading/components/LoadingScreen'
import dynamic from 'next/dynamic'

const RouteCombined = dynamic(() => import('../components/RouteCombined'), {
  ssr: false, // ⭐ 가장 중요! (클라이언트에서만 렌더, 번들 분리됨)
  // loading: () => <LoadingScreen />, // optional: dynamic 자체 로딩 UI
})

export default function RouteMain() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouteCombined />
    </Suspense>
  )
}
