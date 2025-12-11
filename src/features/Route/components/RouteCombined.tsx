'use client'

import RoutePlace from './RoutePlace'
import RouteMap from './RouteMap'
import { useLayoutEffect, useState } from 'react'
import LoadingScreen from '@/features/loading/components/LoadingScreen'

export default function RouteCombined() {
  const [loadingScreenAction, setLoadingSreenAction] = useState<boolean>(false)

  useLayoutEffect(() => {
    const loadingTime = 1500
    setLoadingSreenAction(true)

    const delayTime = setTimeout(() => {
      setLoadingSreenAction(false)
    }, loadingTime)

    return () => clearTimeout(delayTime)
  }, [])

  return (
    <>
      {loadingScreenAction ? (
        <LoadingScreen />
      ) : (
        <>
          <RouteMap />
          <RoutePlace />
        </>
      )}
    </>
  )
}
