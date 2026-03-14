'use client'
import LoadingScreen from '@/features/loading/components/LoadingScreen'
import { usePositionStore, useRoutePlaceIdxStore } from '@/stores/useRouteStore'
import { placeType, RouteApiDataType, TmapPoiItem } from '@/types/placeType'
import {
  addValueByCategory,
  filterApiData,
  formatResult,
  formatStringToArray,
} from '@/util/common/common'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getMyRouteList } from '../../containers/RouteMainContainer'

import LoadingSpin from '../LoadingSpin'
import RoutePlaceBottom from './RoutePlaceBottom'
import RoutePlaceList from './RoutePlaceList'
// import LoadingScreen from '@/features/loading/components/LoadingScreen'

export default function RoutePlace() {
  const searchParams = useSearchParams()
  const queryPurposes = searchParams?.get('purposes') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)
  const queryTime = searchParams?.get('time') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)

  const [routeList, setRouteList] = useState<Record<string, TmapPoiItem[]>>({
    meal: [],
    coffee: [],
    pharmacy: [],
    shopping: [],
    karaoke: [],
    touristSpot: [],
  })

  const {
    mealIdx,
    coffeeIdx,
    pharmacyIdx,
    shoppingIdx,
    karaokeIdx,
    touristSpotIdx,
    initialIdx,
  } = useRoutePlaceIdxStore() // 각 카테고리 별로 장소를 다르게 보여주려 함

  // 전역으로 가져오는 좌표값에 문제가 생길 때, localStorage에서 좌표값을 가져와 fallback으로 사용한다.
  const position =
    usePositionStore(state => state.position) ??
    (typeof window !== 'undefined' &&
      JSON.parse(localStorage.getItem('position') as string))

  // 장소 데이터 가져와 캐싱처리하기
  const { data } = useQuery<RouteApiDataType[]>({
    queryKey: ['place', position, queryPurposes, queryTime], // 검색어
    queryFn: async () => {
      const purposesArr = formatStringToArray(queryPurposes)
      const res = await getMyRouteList(position, purposesArr, queryTime)

      return res
    },
    enabled: !!position && formatStringToArray(queryPurposes).length > 0,

    staleTime: 1000 * 60 * 5, // 5분
    placeholderData: prev => prev,
  })

  // 각 장소별 인덱스를 배열로 관리
  const routePlaceIdxList = [
    mealIdx,
    coffeeIdx,
    pharmacyIdx,
    shoppingIdx,
    karaokeIdx,
    touristSpotIdx,
  ]

  const routeArr = [
    { key: 'meal', list: routeList.meal[mealIdx] ?? routeList.meal[0] },
    {
      key: 'coffee',
      list: routeList.coffee[coffeeIdx] ?? routeList.coffee[0],
    },
    {
      key: 'pharmacy',
      list: routeList.pharmacy[pharmacyIdx] ?? routeList.pharmacy[0],
    },
    {
      key: 'shopping',
      list: routeList.shopping[shoppingIdx] ?? routeList.shopping[0],
    },
    {
      key: 'karaoke',
      list: routeList.karaoke[karaokeIdx] ?? routeList.karaoke[0],
    },
    {
      key: 'touristSpot',
      list: routeList.touristSpot[touristSpotIdx] ?? routeList.touristSpot[0],
    },
  ].filter(Boolean) // undefined 제거

  const routeArrInitial = [
    routeList.meal[0],
    routeList.coffee[0],
    routeList.pharmacy[0],
    routeList.shopping[0],
    routeList.karaoke[0],
    routeList.touristSpot[0],
  ].filter(Boolean) // undefined 제거

  const routeArrSize = [
    routeList.meal.length,
    routeList.coffee.length,
    routeList.pharmacy.length,
    routeList.shopping.length,
    routeList.karaoke.length,
    routeList.touristSpot.length,
  ]

  const resultRouteArrSize = routeArrInitial.length

  const [isLoading, setIsLoading] = useState(false)

  function toggleDisabled(state: boolean) {
    setIsLoading(state)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!position) return
    if (data === undefined) return

    const getData = () => {
      const purposesArr = formatStringToArray(queryPurposes)
      const filterApiArr = filterApiData(data)

      const formatApiData = formatResult(purposesArr, filterApiArr)
      const listArr = {
        meal: [],
        coffee: [],
        pharmacy: [],
        shopping: [],
        karaoke: [],
        touristSpot: [],
      }
      addValueByCategory(listArr, formatApiData)

      setRouteList(listArr)
    }

    initialIdx()
    getData()
  }, [data, initialIdx, position, queryPurposes])

  return (
    <React.Fragment>
      {/* <div> */}
      <LoadingSpin isLoading={isLoading} />
      {resultRouteArrSize > 0 ? (
        <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
          {routeArr.map(
            (place: { key: string; list: placeType | null }, index: number) => (
              <>
                {place.list?.name !== undefined && (
                  <section key={place.key} className="w-full">
                    <div
                      className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex ${
                        routeArrSize[index] <= routePlaceIdxList[index] &&
                        'bg-slate-300'
                      }`}
                    >
                      <RoutePlaceList
                        place={place}
                        routeArrSize={routeArrSize[index]}
                        routePlaceIdxList={routePlaceIdxList[index]}
                      />
                      <RoutePlaceBottom
                        place={place}
                        placeList={routeList[place.key] ?? []}
                        currentIdx={routePlaceIdxList[index]}
                        isDisabled={isLoading}
                        toggleDisabled={toggleDisabled}
                      />
                    </div>
                  </section>
                )}
              </>
            ),
          )}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </React.Fragment>
  )
}
