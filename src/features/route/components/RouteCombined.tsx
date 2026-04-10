'use client'

import RoutePlace from './routeplace/RoutePlace'
import React, { Suspense, useRef } from 'react'
import dynamic from 'next/dynamic'
import RoutePermissionGate from './RoutePermissionGate'
const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
})

export default function RouteCombined() {
  const mapRef = useRef<naver.maps.Map | null>(null)

  return (
    <RoutePermissionGate>
      {position => (
        <div className="relative w-full">
          <RouteMap position={position} mapRef={mapRef} />
          <Suspense fallback={<div></div>}>
            <RoutePlace position={position} mapRef={mapRef} />
          </Suspense>
        </div>
      )}
    </RoutePermissionGate>
  )
}
