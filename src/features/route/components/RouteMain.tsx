'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import RouteCombined from './RouteCombined'
import { queryClient } from '@/lib/queryClient'
import { Suspense } from 'react'

export default function RouteMain() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div />}>
        <RouteCombined />
      </Suspense>
    </QueryClientProvider>
  )
}
