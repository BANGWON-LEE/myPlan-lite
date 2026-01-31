'use client'

import RoutePlace from './RoutePlace'
import React, { Suspense, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'
import { POSITION_QUERY_KEY } from '@/lib/queryKeys'
const RouteMap = dynamic(() => import('../components/RouteMap'), {
  ssr: false,
})

export default function RouteCombined() {
  // 현재 좌표 가져오기
  const getPosition = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
      )
    })

  // 현재 좌표값 캐싱처리
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
      <div className="relative w-full">
        <RouteMap position={position} />
        <Suspense fallback={<div></div>}>
          <RoutePlace />
        </Suspense>
      </div>
    </React.Fragment>
  )
}
