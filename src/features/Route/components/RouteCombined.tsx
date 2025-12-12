'use client'

import RoutePlace from './RoutePlace'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
const RouteMap = dynamic(() => import('../components/RouteMap'), {
  ssr: false,
})

export default function RouteCombined() {
  return (
    <>
      <RouteMap />
      <Suspense fallback={<div></div>}>
        <RoutePlace />
      </Suspense>
    </>
  )
}
