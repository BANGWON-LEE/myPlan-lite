'use client'

import RoutePlace from './RoutePlace'
// import RouteMap from './RouteMap'
import { Suspense, useLayoutEffect, useState } from 'react'
import LoadingScreen from '@/features/loading/components/LoadingScreen'
import dynamic from 'next/dynamic'
const RouteMap = dynamic(() => import('../components/RouteMap'), {
  ssr: false,
})

export default function RouteCombined() {
  // const [loadingScreenAction, setLoadingSreenAction] = useState<boolean>(true)

  // useLayoutEffect(() => {
  //   const loadingTime = 1500
  //   // setLoadingSreenAction(true)

  //   const delayTime = setTimeout(() => {
  //     setLoadingSreenAction(false)
  //   }, loadingTime)

  //   return () => clearTimeout(delayTime)
  // }, [])

  return (
    // <>
    //   {loadingScreenAction ? (
    //     <LoadingScreen />
    //   ) : (
    <>
      <RouteMap />
      <Suspense fallback={<div></div>}>
        <RoutePlace />
      </Suspense>
    </>
    //   )}
    // </>
  )
}
