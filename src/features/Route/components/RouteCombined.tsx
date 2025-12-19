'use client'

import RoutePlace from './RoutePlace'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
const RouteMap = dynamic(() => import('../components/RouteMap'), {
  ssr: false,
})

export default function RouteCombined() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouteMap />
      </QueryClientProvider>
      <Suspense fallback={<div></div>}>
        <RoutePlace />
      </Suspense>
    </>
  )
}
