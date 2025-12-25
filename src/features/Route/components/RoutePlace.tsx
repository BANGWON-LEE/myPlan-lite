'use client'
import dynamic from 'next/dynamic'
import { StatLabel } from '@/share/components/Text'
import { placeType, RouteApiDataType, TmapPoiItem } from '@/types/placeType'
import {
  addValueByCategory,
  filterApiData,
  formatResult,
  formatStringToArray,
  getHourTimeMinTimeFormat,
} from '@/util/common/common'
import { goalMarker, onLoadMarkerMap } from '@/util/map/mapFunctions'

const Icon = {
  Phone: dynamic(() => import('lucide-react').then(m => m.Phone)),
  Clock: dynamic(() => import('lucide-react').then(m => m.Clock)),
  MapPin: dynamic(() => import('lucide-react').then(m => m.MapPin)),
}

// import { Clock, MapPin, Phone } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { getMyRouteList } from '../containers/RouteMainContainer'
import LoadingScreen from '@/features/loading/components/LoadingScreen'
import { usePositionStore, useRoutePlaceIdxStore } from '@/stores/useRouteStore'
import { useQuery } from '@tanstack/react-query'
import { PLACE_QUERY_KEY } from '@/lib/queryKeys'
// import LoadingScreen from '@/features/loading/components/LoadingScreen'

export default function RoutePlace() {
  const searchParams = useSearchParams()
  const queryPurposes = searchParams?.get('purposes') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)
  const queryTime = searchParams?.get('time') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)
  const purposesArr = formatStringToArray(queryPurposes)

  const [routeList, setRouteList] = useState<Record<string, TmapPoiItem[]>>({
    meal: [],
    coffee: [],
    walk: [],
    shopping: [],
  })

  const { idx, initialIdx } = useRoutePlaceIdxStore()
  const position = usePositionStore(state => state.position)

  const { data } = useQuery<RouteApiDataType[]>({
    queryKey: ['place', position, purposesArr, queryTime], // 검색어
    queryFn: async () => {
      const res = await getMyRouteList(position, purposesArr, queryTime)

      return res
    },
    enabled: !!position && purposesArr.length > 0,

    staleTime: 1000 * 60 * 5, // 5분
    placeholderData: prev => prev,
  })

  useEffect(() => {
    // alert('호출! 1번')
    if (typeof window === undefined) return
    // alert('호출! 2번')
    if (!position) return
    // alert('호출! 3번')
    if (data === undefined) return
    // alert('호출! 4번')

    const getData = () => {
      const filterApiArr = filterApiData(data)

      const formatApiData = formatResult(purposesArr, filterApiArr)
      const listArr = { meal: [], coffee: [], walk: [], shopping: [] }
      // addValueByCategory(setRouteList, purposesArr, formatApiData)
      addValueByCategory(listArr, formatApiData)

      setRouteList(listArr)
      // return result
    }
    initialIdx()
    getData()
  }, [data])

  const routeArr = [
    routeList.meal[idx],
    routeList.coffee[idx],
    routeList.walk[idx],
    routeList.shopping[idx],
  ].filter(Boolean) // undefined 제거

  const routeArrInitial = [
    routeList.meal[0],
    routeList.coffee[0],
    routeList.walk[0],
    routeList.shopping[0],
  ].filter(Boolean) // undefined 제거

  const routeArrSize = [
    routeList.meal.length,
    routeList.coffee.length,
    routeList.walk.length,
    routeList.shopping.length,
  ].filter(Boolean) // undefined 제거

  const resultRouteArr =
    routeArr.length === 0 && idx === 0 ? 0 : routeArrInitial.length

  const prevPath = {
    x: 0,
    y: 0,
  }

  function validatePath(
    prevPath: { x: number; y: number },
    lat: number,
    lon: number
  ) {
    if (lat === prevPath.x && lon === prevPath.y) return false

    prevPath.x = lat
    prevPath.y = lon
    return true
  }

  const requestIdRef = useRef(0) // 요청 번호 발급기
  const latestRequestIdRef = useRef(1) // 마지막 요청 번호

  function validateLastRequest(requestId: number) {
    if (requestId < latestRequestIdRef.current) return false

    latestRequestIdRef.current = requestId
    return true
  }

  function drawMarker(lat: number, lon: number) {
    const requestId = ++requestIdRef.current

    if (!validatePath(prevPath, lat, lon)) return

    requestAnimationFrame(() => {
      if (!validateLastRequest(requestId)) return

      const map = onLoadMarkerMap({ x: lat, y: lon })
      goalMarker(map, { x: lon, y: lat })
    })
  }

  return (
    <React.Fragment>
      {resultRouteArr > 0 ? (
        <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
          {/* <div className=" bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <StatLabel>총 소요시간</StatLabel>
                <StatValue>약 10분</StatValue>
              </div>
              <div className="text-right">
                <StatLabel>총 거리</StatLabel>
                <StatValue color="text-gray-900">1.3km</StatValue>
              </div>
            </div>
          </div> */}
          {/* 
      {[
        {
          id: 1,
          name: '그린카페',
          type: '카페',
          rating: 4.5,
          distance: '250m',
          time: '3분',
        },
        {
          id: 2,
          name: '한강뷰 공원',
          type: '산책',
          rating: 4.8,
          distance: '600m',
          time: '8분',
        },
        {
          id: 3,
          name: '북카페 라운지',
          type: '휴식',
          rating: 4.6,
          distance: '450m',
          time: '6분',
        },
      ] */}
          {(routeArr.length === 0 ? routeArrInitial : routeArr).map(
            (place: placeType | null, index: number) => (
              <button
                key={index + 1}
                onClick={() =>
                  drawMarker(Number(place?.pnsLat), Number(place?.pnsLon))
                }
                className="w-full"
              >
                <div
                  className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    routeArrSize[index] <= idx && 'bg-slate-300'
                  }`}
                >
                  <div className="flex">
                    {/* <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-purple-100"></div> */}
                    <div className="flex-1 p-4">
                      <div className="flex w-full items-start justify-between mb-2">
                        <div className="w-full grid text-left">
                          <span className="text-sm font-semibold text-red-500">
                            {/* {routeArr[index].name !== place?.name && */}
                            {routeArrSize[index] <= idx &&
                              '더 이상 추천할 장소가 없습니다'}
                          </span>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-indigo-600">
                              #{index + 1}
                            </span>
                            <h3 className="font-bold text-gray-900">
                              {place?.name}
                            </h3>
                          </div>
                          {/* StatLabel 컴포넌트 사용 */}
                          <StatLabel>{place?.middleBizName}</StatLabel>
                        </div>
                      </div>
                      <div className="grid items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Icon.Phone className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span>{place?.telNo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon.MapPin className="w-4 h-4" />
                          <span>
                            {
                              place?.newAddressList.newAddress[0]
                                .fullAddressRoad
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon.Clock className="w-4 h-4" />
                          <span>
                            {getHourTimeMinTimeFormat(Number(place?.radius))
                              .hours > 0
                              ? `${getHourTimeMinTimeFormat(
                                  Number(place?.radius)
                                ).hours.toString()}시간 ${getHourTimeMinTimeFormat(
                                  Number(place?.radius)
                                ).minutes.toString()}분`
                              : `${getHourTimeMinTimeFormat(
                                  Number(place?.radius)
                                ).minutes.toString()}분`}{' '}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            )
          )}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </React.Fragment>
  )
}
