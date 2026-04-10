'use client'

import RoutePlace from './routeplace/RoutePlace'
import React, { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import RoutePermissionGate from './RoutePermissionGate'
import { TmapPoiItem } from '@/types/placeType'
import { useRoutePlaceIdxStore } from '@/stores/useRouteStore'
import { getSelectedRoutePoints } from '../containers/drawRouteContainer'
import { RouteCategoryKey } from '@/types/routeType'
import { useSearchParams } from 'next/navigation'
import { formatStringToArray } from '@/util/common/common'

const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
})

export default function RouteCombined() {
  const [routeList, setRouteList] = useState<
    Record<RouteCategoryKey, TmapPoiItem[]>
  >({
    meal: [],
    coffee: [],
    pharmacy: [],
    shopping: [],
    karaoke: [],
    touristSpot: [],
  })
  const searchParams = useSearchParams()
  const queryPurposes = searchParams?.get('purposes') ?? ''

  const {
    mealIdx,
    coffeeIdx,
    pharmacyIdx,
    shoppingIdx,
    karaokeIdx,
    touristSpotIdx,
  } = useRoutePlaceIdxStore() // 각 카테고리 별로 장소를 다르게 보여주려 함

  const routePlaceIndexes = useMemo(
    () => ({
      meal: mealIdx,
      coffee: coffeeIdx,
      pharmacy: pharmacyIdx,
      shopping: shoppingIdx,
      karaoke: karaokeIdx,
      touristSpot: touristSpotIdx,
    }),
    [mealIdx, coffeeIdx, pharmacyIdx, shoppingIdx, karaokeIdx, touristSpotIdx],
  )

  const purposesArr = useMemo(
    () => formatStringToArray(queryPurposes).filter(Boolean),
    [queryPurposes],
  )

  const selectedRoutePoints = useMemo(
    () => getSelectedRoutePoints(purposesArr, routeList, routePlaceIndexes),
    [purposesArr, routeList, routePlaceIndexes],
  )
  return (
    <RoutePermissionGate>
      {position => (
        <div className="relative w-full">
          <RouteMap
            position={position}
            selectedRoutePoints={selectedRoutePoints}
          />
          <RoutePlace
            position={position}
            routeList={routeList}
            setRouteList={setRouteList}
            routePlaceIndexes={routePlaceIndexes}
            selectedRoutePoints={selectedRoutePoints}
          />
        </div>
      )}
    </RoutePermissionGate>
  )
}
