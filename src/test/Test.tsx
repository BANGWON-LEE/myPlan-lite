'use client'

import MapScript from '@/components/MapScript'
import {
  drawOrderedRouteMain,
  normalizePurpose,
} from '@/features/route/containers/drawRouteContainer'
import { formatStringToArray } from '@/util/common/common'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'

export default function Test() {
  const searchParams = useSearchParams()
  const mapRef = useRef<naver.maps.Map | null>(null)

  const purposes = useMemo(() => {
    return formatStringToArray(searchParams?.get('purposes') ?? '')
      .map(normalizePurpose)
      .filter(Boolean)
  }, [searchParams])

  const time = searchParams?.get('time') ?? '1'

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof naver === 'undefined') return
    if (purposes.length === 0) return

    let cancelled = false

    const run = async () => {
      if (cancelled) return
      await drawOrderedRouteMain(mapRef, purposes, time)
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [purposes, time])

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <MapScript />
      <div id="map" className="h-80 w-full bg-slate-100" />
    </div>
  )
}
