'use client'

import RoutePlace from './routeplace/RoutePlace'
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import RoutePermissionGate from './RoutePermissionGate'
const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
})

export default function RouteCombined() {
  return (
    <RoutePermissionGate>
      {position => (
        <div className="relative w-full">
          <RouteMap position={position} />
          <Suspense fallback={<div></div>}>
            <RoutePlace position={position} />
          </Suspense>
        </div>
      )}
    </RoutePermissionGate>
  )
}
