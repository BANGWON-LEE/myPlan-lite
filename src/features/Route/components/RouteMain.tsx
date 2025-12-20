'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import RouteCombined from './RouteCombined'
import { queryClient } from '@/lib/queryClient'

export default function RouteMain() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouteCombined />
    </QueryClientProvider>
  )
}
