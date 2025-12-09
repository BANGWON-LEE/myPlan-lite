'use client'

import { Suspense } from 'react'
import RoutePlace from './RoutePlace'

export default function RouteMain() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <RoutePlace />
    </Suspense>
  )
}
