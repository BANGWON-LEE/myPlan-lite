'use client'
import {
  drawOrderedRouteByPlacesMain,
  getSelectedRoutePoints,
} from '@/features/route/containers/drawRouteContainer'
import LoadingScreen from '@/features/loading/components/LoadingScreen'
import {
  useRoutePathStore,
  useRoutePlaceIdxStore,
} from '@/stores/useRouteStore'
import { placeType, RouteApiDataType, TmapPoiItem } from '@/types/placeType'
import {
  addValueByCategory,
  filterApiData,
  formatResult,
  formatStringToArray,
} from '@/util/common/common'
import { PURPOSE_TO_CATEGORY_KEY } from '@/data/constant'
import { RouteCategoryKey } from '@/types/routeType'

import { useQuery } from '@tanstack/react-query'
import { ArrowDown } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getMyRouteList } from '../../containers/RouteMainContainer'

import LoadingSpin from '../LoadingSpin'
import RoutePlaceBottom from './RoutePlaceBottom'
import RoutePlaceList from './RoutePlaceList'

export default function RoutePlace({
  position,
}: {
  position: GeolocationPosition
}) {
  const searchParams = useSearchParams()
  const queryPurposes = searchParams?.get('purposes') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)
  const queryTime = searchParams?.get('time') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)
  const mapRef = useRef<naver.maps.Map | null>(null)

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
  const setRoutePath = useRoutePathStore(state => state.setPath)

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

  const [isLoading, setIsLoading] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)
  const purposesArr = useMemo(
    () => formatStringToArray(queryPurposes).filter(Boolean),
    [queryPurposes],
  )

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

  const selectedRoutePoints = useMemo(
    () => getSelectedRoutePoints(purposesArr, routeList, routePlaceIndexes),
    [purposesArr, routeList, routePlaceIndexes],
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

    const getData = (data: RouteApiDataType[]) => {
      // 쿼리 파라미터로 전달된 목적(purposes)을 배열로 변환
      const purposesArr = formatStringToArray(queryPurposes)
      // API 응답에서 장소 데이터만 추출
      const filterApiArr = filterApiData(data)

      // 카테고리 키에 맞게 데이터를 각 객체 형태로 매핑하여 상태 업데이트
      // 요청한 카테고리의 값만 응답으로 옴
      const formatApiData = formatResult(purposesArr, filterApiArr)

      const listArr = {
        meal: [],
        coffee: [],
        pharmacy: [],
        shopping: [],
        karaoke: [],
        touristSpot: [],
      }

      //listArr 객체에 키에 맞게 formatApiData의 데이터가 들어가도록 처리하는 함수
      addValueByCategory(listArr, formatApiData)

      setRouteList(listArr)
    }

    initialIdx()
    getData(data)
  }, [data, initialIdx, position, queryPurposes])

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Naver Map SDK는 Script로 비동기 로드되므로, 전역 객체가 준비된 뒤에만 경로를 그린다.
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
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isMapReady) return
    if (!position) return
    if (selectedRoutePoints.length === 0) return

    let cancelled = false

    const drawRoute = async () => {
      toggleDisabled(true)

      try {
        const path = await drawOrderedRouteByPlacesMain(
          mapRef,
          selectedRoutePoints,
        )
        if (!cancelled && path) {
          setRoutePath(path)
        }
      } finally {
        if (!cancelled) {
          toggleDisabled(false)
        }
      }
    }

    drawRoute()

    return () => {
      cancelled = true
    }
  }, [isMapReady, position, selectedRoutePoints, setRoutePath])

  return (
    <React.Fragment>
      {/* <div> */}
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
