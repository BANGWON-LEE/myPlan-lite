'use client'

import RoutePlace from './RoutePlace'
import React, { Suspense, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { usePositionStore } from '@/stores/useRouteStore'
import { POSITION_QUERY_KEY } from '@/lib/queryKeys'
const RouteMap = dynamic(() => import('../components/RouteMap'), {
  ssr: false,
})

export default function RouteCombined() {
  const getPosition = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error)
      )
    })

  const { data: position } = useQuery<GeolocationPosition>({
    queryKey: POSITION_QUERY_KEY,
    queryFn: async () => await getPosition(),
    staleTime: 1000 * 60 * 5, // 5분
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!position) return
  }, [position])

  return (
    <React.Fragment>
      <>
        <RouteMap position={position} />
        <Suspense fallback={<div></div>}>
          <RoutePlace />
        </Suspense>
      </>
    </React.Fragment>
  )
}
