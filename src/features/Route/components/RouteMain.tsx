'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import RouteBottom from './RouteBottom'
import RouteHeader from './RouteHeader'
import RouteMap from './RouteMap'
import RoutePlace from './RoutePlace'
import { getMyRouteList } from '../containers/RouteMainContainer'
import { getCurrentPositionPromise } from '@/util/map/mapFunctions'
import {
  addValueByCategory,
  filterApiData,
  formatStringToArray,
} from '@/util/common/common'
import { TmapPoiItem } from '@/types/placeType'
import { useRouter } from 'next/router'
import LoadingScreen from '@/features/loading/components/LoadingScreen'

export default function RouteMain() {
  const searchParams = useSearchParams()
  const queryPurposes = searchParams?.get('purposes') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)
  const queryTime = searchParams?.get('time') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)

  const [routeList, setRouteList] = useState<Record<string, TmapPoiItem[]>>({
    meal: [],
    coffee: [],
    walk: [],
    shopping: [],
  })

  useEffect(() => {
    const getData = async () => {
      const purposesArr = formatStringToArray(queryPurposes)
      console.log('queryPur', queryPurposes)
      // const myLoc = await getMyLoc()
      const position = await getCurrentPositionPromise()

      purposesArr.forEach(async (purpose: string) => {
        addValueByCategory(
          setRouteList,
          purpose,
          filterApiData(await getMyRouteList(position, purpose, queryTime))
        )
      })

      // const result =
    }

    getData()
  }, [queryPurposes, queryTime])

  const routeArr = [
    routeList.meal[0],
    routeList.coffee[0],
    routeList.walk[0],
    routeList.shopping[0],
  ].filter(Boolean) // undefined 제거

  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="font-sans">
        <div className="min-h-screen bg-gray-50">
          <RouteHeader />
          <RouteMap />
          <RoutePlace routeArr={routeArr} />
          <RouteBottom />
        </div>
      </div>
    </Suspense>
  )
}
