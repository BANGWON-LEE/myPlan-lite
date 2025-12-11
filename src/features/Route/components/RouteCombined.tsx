'use client'

import RoutePlace from './RoutePlace'
import RouteMap from './RouteMap'
import { useLayoutEffect, useState } from 'react'
import LoadingScreen from '@/features/loading/components/LoadingScreen'

export default function RouteCombined() {
  // console.log('combined')

  return (
    <>
      <RouteMap />
      <RoutePlace />
    </>
  )
}
