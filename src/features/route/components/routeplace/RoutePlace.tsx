'use client'
import {
  clearRouteOverlays,
  drawOrderedRouteByPlacesMain,
  getRouteStartPointFromPosition,
  getSelectedRoutePoints,
} from '@/features/route/containers/drawRouteContainer'
import LoadingScreen from '@/features/loading/components/LoadingScreen'
import {
  usePositionStore,
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
// import LoadingScreen from '@/features/loading/components/LoadingScreen'

const ROUTE_SIGNATURE_COORD_PRECISION = 3

function toRouteSignatureCoord(value: number) {
  return value.toFixed(ROUTE_SIGNATURE_COORD_PRECISION)
}

function createRouteRequestSignature(
  startPoint: { x: number; y: number },
  routePoints: { x: number; y: number }[],
) {
  const pointsSignature = routePoints
    .map(point => `${toRouteSignatureCoord(point.x)},${toRouteSignatureCoord(point.y)}`)
    .join('|')

  return `${toRouteSignatureCoord(startPoint.x)},${toRouteSignatureCoord(startPoint.y)}->${pointsSignature}`
}

export default function RoutePlace({
  position,
}: {
  position: GeolocationPosition
}) {
  const livePosition = usePositionStore(state => state.position)
  const currentPosition = livePosition ?? position
  const searchParams = useSearchParams()
  const queryPurposes = searchParams?.get('purposes') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)
  const queryTime = searchParams?.get('time') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)
  const mapRef = useRef<naver.maps.Map | null>(null)
  const routeOverlaysRef = useRef<(naver.maps.Marker | naver.maps.Polyline)[]>([])
  const routeStartPointRef = useRef(
    getRouteStartPointFromPosition(currentPosition),
  )

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
  const [shouldShowFindingSpinner, setShouldShowFindingSpinner] = useState(true)
  const [isMapReady, setIsMapReady] = useState(false)
  const hasDrawnInitialRouteRef = useRef(false)
  const showSpinnerOnNextDrawRef = useRef(false)
  const lastRouteRequestSignatureRef = useRef<string | null>(null)
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

  function handleSearchOtherPlace() {
    showSpinnerOnNextDrawRef.current = true
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!currentPosition) return
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
  }, [currentPosition, data, initialIdx, queryPurposes])

  useEffect(() => {
    if (!currentPosition) return
    routeStartPointRef.current = getRouteStartPointFromPosition(currentPosition)
  }, [currentPosition])

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Naver Map SDK는 Script로 비동기 로드되므로, 전역 객체가 준비된 뒤에만 경로를 그린다.
    if (typeof naver !== 'undefined') {
      setIsMapReady(true)
      return
    }

    let rafId = 0
    const checkNaverReady = () => {
      if (typeof naver !== 'undefined') {
        setIsMapReady(true)
        return
      }
      rafId = window.requestAnimationFrame(checkNaverReady)
    }

    rafId = window.requestAnimationFrame(checkNaverReady)

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    const routeOverlays = routeOverlaysRef.current
    return () => {
      clearRouteOverlays(routeOverlays)
    }
  }, [])

  useEffect(() => {
    // 브라우저 환경에서만 지도 관련 로직을 실행한다.
    if (typeof window === 'undefined') return
    // 지도가 아직 준비되지 않았다면 경로를 그릴 수 없다.
    if (!isMapReady) return
    // 선택된 장소가 없으면 그릴 경로도 없다.
    if (selectedRoutePoints.length === 0) return
    if (!currentPosition) return

    const routeRequestSignature = createRouteRequestSignature(
      routeStartPointRef.current,
      selectedRoutePoints,
    )
    const shouldForceDraw = showSpinnerOnNextDrawRef.current

    if (
      !shouldForceDraw &&
      routeRequestSignature === lastRouteRequestSignatureRef.current
    ) {
      return
    }

    // effect가 정리(cleanup)된 뒤에는 비동기 결과를 무시하기 위한 플래그다.
    let cancelled = false

    const drawRoute = async () => {
      const shouldShowSpinner =
        !hasDrawnInitialRouteRef.current || showSpinnerOnNextDrawRef.current

      if (shouldShowSpinner) {
        setShouldShowFindingSpinner(true)
      }

      // 경로 계산이 진행되는 동안 관련 UI를 비활성화 처리한다.
      toggleDisabled(true)

      try {
        // 선택된 장소 순서대로 실제 지도 경로를 계산한다.
        const path = await drawOrderedRouteByPlacesMain(
          mapRef,
          selectedRoutePoints,
          routeStartPointRef.current,
          routeOverlaysRef.current,
        )
        // effect가 아직 유효하고 경로가 있으면 상태에 반영한다.
        if (!cancelled && path) {
          setRoutePath(path)
          lastRouteRequestSignatureRef.current = routeRequestSignature
        }
      } finally {
        // cleanup 이후가 아니라면 비활성화 상태를 원복한다.
        if (!cancelled) {
          toggleDisabled(false)
          hasDrawnInitialRouteRef.current = true
          if (shouldShowSpinner) {
            setShouldShowFindingSpinner(false)
            showSpinnerOnNextDrawRef.current = false
          }
        }
      }
    }

    const drawTimerId = window.setTimeout(() => {
      drawRoute()
    }, 150)

    return () => {
      // 의존성이 바뀌거나 언마운트되면 이후 비동기 결과를 무시한다.
      cancelled = true
      window.clearTimeout(drawTimerId)
    }
  }, [currentPosition, isMapReady, selectedRoutePoints, setRoutePath])

  return (
    <React.Fragment>
      {/* <div> */}
      <LoadingSpin isLoading={isLoading && shouldShowFindingSpinner} />
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
                    onSearchOtherPlace={handleSearchOtherPlace}
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
