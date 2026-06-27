'use client'
import LoadingScreen from '@/features/loading/components/LoadingScreen'
import { useMapReadyStore } from '@/stores/useRouteStore'
import {
  MapScriptProps,
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
import { useQuery } from '@tanstack/react-query'
import { ArrowDown } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'
import { getMyRouteList } from '../../containers/RouteMainContainer'
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
}: RoutePlaceProps) {
  const searchParams = useSearchParams()
  const queryPurposes = searchParams?.get('purposes') ?? ''
  const queryTime = searchParams?.get('time') ?? ''

  const isMapLoadReady = useMapReadyStore(state => state.isMapReady)

  const setIsMapLoadReady = useMapReadyStore(state => state.setIsMapReady)

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

  const purposesArr = useMemo(
    () => formatStringToArray(queryPurposes).filter(Boolean),
    [queryPurposes],
  )

  const routeArr: {
    key: RouteCategoryKey
    list: TmapPoiItem[]
    currentIdx: number
    routeArrSize: number
    renderKey: string
  }[] = []

  purposesArr.forEach((purpose, index) => {
    const categoryKey = PURPOSE_TO_CATEGORY_KEY[purpose]
    if (!categoryKey) return

    const currentIdx = routePlaceIndexes[categoryKey] ?? 0
    const placeList = routeList[categoryKey] ?? []
    const selectedPlace = placeList

    if (!selectedPlace || selectedPlace.length === 0) return

    routeArr.push({
      key: categoryKey,
      list: selectedPlace,
      currentIdx,
      routeArrSize: placeList.length,
      renderKey: `${categoryKey}-${index}`,
    })
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!position) return
    if (data === undefined) return

    const purposes = formatStringToArray(queryPurposes)
    const filterApiArr = filterApiData(data)
    const formatApiData = formatResult(purposes, filterApiArr)

    const listArr: Record<RouteCategoryKey, TmapPoiItem[]> = {
      bank: [],
      hospital: [],
      pharmacy: [],
      shopping: [],
      karaoke: [],
      toilet: [],
    }

    addValueByCategory(listArr, formatApiData)
    setRouteList(listArr)
  }, [data, position, queryPurposes, setRouteList])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof naver !== 'undefined') {
      setIsMapLoadReady(true)
      return
    }

    const timer = window.setInterval(() => {
      if (typeof naver !== 'undefined') {
        setIsMapLoadReady(true)
        window.clearInterval(timer)
      }
    }, 300)

    return () => {
      window.clearInterval(timer)
    }
  }, [isMapLoadReady])

  return (
    <React.Fragment>
      {routeArr.length > 0 ? (
        <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
          {routeArr.map((place, index) => (
            <React.Fragment key={place.renderKey}>
              <section className="w-full flex overflow-x-auto scrollbar-hide">
                {place.list.map((item: TmapPoiItem, idx: number) => (
                  <div
                    key={`${place.key}-${idx}`}
                    className="mb-2 w-full flex-shrink-0  items-center justify-center"
                  >
                    <div
                      className={`bg-white h-full mr-4 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex ${
                        place.routeArrSize <= place.currentIdx && 'bg-slate-300'
                      }`}
                    >
                      <RoutePlaceList
                        index={idx}
                        place={{ key: place.key, list: item }}
                        isDisabled={place.routeArrSize <= place.currentIdx}
                        routeArrSize={place.routeArrSize}
                        routePlaceIdxList={place.currentIdx}
                      />
                    </div>
                  </div>
                ))}
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
