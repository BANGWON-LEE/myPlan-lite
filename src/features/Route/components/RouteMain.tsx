'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import RouteBottom from './RouteBottom'
import RouteHeader from './RouteHeader'
import RouteMap from './RouteMap'
import RoutePlace from './RoutePlace'
import { getMyRouteList } from '../containers/RouteMainContainer'
import {
  getCurrentPositionPromise,
  getMapOptions,
  getMyLocAddress,
} from '@/util/map/mapFunctions'

export default function RouteMain() {
  const searchParams = useSearchParams()
  const queryPurposes = searchParams?.get('purposes') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)
  const queryTime = searchParams?.get('time') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)

  async function getMyLoc(): Promise<{
    jibunAddress: string
    roadAddress: string
  }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const address = await getMyLocAddress(pos)
          resolve(address)
        },
        err => reject(err)
      )
    })
  }

  useEffect(() => {
    const getData = async () => {
      console.log('render useEffect')
      // const myLoc = await getMyLoc()
      const position = await getCurrentPositionPromise()
      getMyRouteList(position, queryPurposes, queryTime)
    }

    getData()
  }, [queryPurposes, queryTime])

  return (
    <div className="font-sans">
      <div className="min-h-screen bg-gray-50">
        <RouteHeader />
        <RouteMap />
        <RoutePlace />
        <RouteBottom />
      </div>
    </div>
  )
}
