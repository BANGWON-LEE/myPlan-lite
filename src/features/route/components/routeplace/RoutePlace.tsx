'use client'
import {
  drawRouteByPoints,
  getDrawMyMarker,
  getInitialMapPosition,
} from '@/features/route/containers/drawRouteContainer'
import LoadingScreen from '@/features/loading/components/LoadingScreen'
import {
  useMapStore,
  useMapReadyStore,
  useRoutePathStore,
  useRoutePlaceIdxStore,
  useStartPointStore,
  useCurrentPosiMarkerStore,
} from '@/stores/useRouteStore'
import {
  MapScriptProps,
  placeType,
  RouteApiDataType,
  TmapPoiItem,
} from '@/types/placeType'
import { RouteCategoryKey, RoutePoint } from '@/types/routeType'
import {
  addValueByCategory,
  filterApiData,
  formatResult,
  formatStringToArray,
} from '@/util/common/common'
import { PURPOSE_TO_CATEGORY_KEY } from '@/data/constant'
import { getCurrentPositionPromise } from '@/util/map/mapFunctions'
import { useQuery } from '@tanstack/react-query'
import { ArrowDown } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { getMyRouteList } from '../../containers/RouteMainContainer'
import LoadingSpin from '../LoadingSpin'
import RoutePlaceBottom from './RoutePlaceBottom'
import RoutePlaceList from './RoutePlaceList'

type RoutePlaceProps = MapScriptProps & {
  routeList: Record<RouteCategoryKey, TmapPoiItem[]>
  setRouteList: React.Dispatch<
    React.SetStateAction<Record<RouteCategoryKey, TmapPoiItem[]>>
  >
  routePlaceIndexes: Record<RouteCategoryKey, number>
  selectedRoutePoints: RoutePoint[]
}

export default function RoutePlace({
  position,
  routeList,
  setRouteList,
  routePlaceIndexes,
  selectedRoutePoints,
}: RoutePlaceProps) {
  const searchParams = useSearchParams()
  const queryPurposes = searchParams?.get('purposes') ?? ''
  const queryTime = searchParams?.get('time') ?? ''

  const { initialIdx } = useRoutePlaceIdxStore()
  const setRoutePath = useRoutePathStore(state => state.setPath)
  const setStartPoint = useStartPointStore(state => state.setStartPoint)
  const setMap = useMapStore(state => state.setMap)
  const setCurrentPosiMarker = useCurrentPosiMarkerStore(
    state => state.setCurrentPosiMarker,
  )
  const isMapReady = useMapReadyStore(state => state.isMapReady)
  const setIsMapReady = useMapReadyStore(state => state.setIsMapReady)

  const { data } = useQuery<RouteApiDataType[]>({
    queryKey: ['place', position, queryPurposes, queryTime],
    queryFn: async () => {
      const purposesArr = formatStringToArray(queryPurposes)
      return getMyRouteList(position, purposesArr, queryTime)
    },
    enabled: !!position && formatStringToArray(queryPurposes).length > 0,
    staleTime: 1000 * 60 * 5,
    placeholderData: prev => prev,
  })

  const [isLoading, setIsLoading] = useState(false)
  const purposesArr = useMemo(
    () => formatStringToArray(queryPurposes).filter(Boolean),
    [queryPurposes],
  )

  const routeArr: {
    key: RouteCategoryKey
    list: placeType
    placeList: TmapPoiItem[]
    currentIdx: number
    routeArrSize: number
    renderKey: string
  }[] = []

  purposesArr.forEach((purpose, index) => {
    const categoryKey = PURPOSE_TO_CATEGORY_KEY[purpose]
    if (!categoryKey) return

    const currentIdx = routePlaceIndexes[categoryKey] ?? 0
    const placeList = routeList[categoryKey] ?? []
    const selectedPlace = placeList[currentIdx] ?? placeList[0]

    if (!selectedPlace) return

    routeArr.push({
      key: categoryKey,
      list: selectedPlace,
      placeList,
      currentIdx,
      routeArrSize: placeList.length,
      renderKey: `${categoryKey}-${index}`,
    })
  })

  function toggleDisabled(state: boolean) {
    setIsLoading(state)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!position) return
    if (data === undefined) return

    const purposes = formatStringToArray(queryPurposes)
    const filterApiArr = filterApiData(data)
    const formatApiData = formatResult(purposes, filterApiArr)

    const listArr: Record<RouteCategoryKey, TmapPoiItem[]> = {
      meal: [],
      coffee: [],
      pharmacy: [],
      shopping: [],
      karaoke: [],
      touristSpot: [],
    }

    addValueByCategory(listArr, formatApiData)
    initialIdx()
    setRouteList(listArr)
  }, [data, initialIdx, position, queryPurposes, setRouteList])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof naver !== 'undefined') {
      setIsMapReady(true)
      return
    }

    const timer = window.setInterval(() => {
      if (typeof naver !== 'undefined') {
        setIsMapReady(true)
        window.clearInterval(timer)
      }
    }, 300)

    return () => {
      window.clearInterval(timer)
    }
  }, [setIsMapReady])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isMapReady) return
    if (!position) return
    if (selectedRoutePoints.length === 0) return

    let cancelled = false

    const drawRoute = async () => {
      toggleDisabled(true)
      try {
        const currentPosition = await getCurrentPositionPromise()
        const startPoint = {
          x: currentPosition.coords.longitude,
          y: currentPosition.coords.latitude,
          name: '현재 위치',
        }

        const map = await getInitialMapPosition([startPoint])
        if (!cancelled && map) {
          const currentPosiMarker = getDrawMyMarker(
            map,
            startPoint,
            startPoint.name,
          )
          setCurrentPosiMarker(currentPosiMarker)
          const path = await drawRouteByPoints(
            map,
            selectedRoutePoints,
            startPoint,
          )
          setMap(map)
          setRoutePath(path)
          setStartPoint(startPoint)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    drawRoute()
    return () => {
      cancelled = true
    }
  }, [
    isMapReady,
    position,
    selectedRoutePoints,
    setMap,
    setCurrentPosiMarker,
    setRoutePath,
    setStartPoint,
  ])

  return (
    <React.Fragment>
      <LoadingSpin isLoading={isLoading} />
      {routeArr.length > 0 ? (
        <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
          {routeArr.map((place, index) => (
            <React.Fragment key={place.renderKey}>
              <section className="w-full">
                <div
                  className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex ${
                    place.routeArrSize <= place.currentIdx && 'bg-slate-300'
                  }`}
                >
                  <RoutePlaceList
                    place={place}
                    routeArrSize={place.routeArrSize}
                    routePlaceIdxList={place.currentIdx}
                  />
                  <RoutePlaceBottom
                    place={place}
                    placeList={place.placeList}
                    currentIdx={place.currentIdx}
                    isDisabled={isLoading}
                  />
                </div>
              </section>
              {index < routeArr.length - 1 && (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm">
                    <ArrowDown className="h-5 w-5" />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </React.Fragment>
  )
}
