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
import {
  goalMarker,
  onLoadMarkerMap,
  setWalkPolyLine,
  startMarker,
} from '@/util/map/mapFunctions'

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
import FindingPlaceSpinner from '@/share/components/FindingPlaceSpinner'
import {
  goalRouteType,
  startRouteType,
  tmapRoutePathType,
} from '@/types/routeType'
import { initialPlaceObj } from '@/data/constant'
// import LoadingScreen from '@/features/loading/components/LoadingScreen'

export default function RoutePlace() {
  const searchParams = useSearchParams()
  const queryPurposes = searchParams?.get('purposes') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)
  const queryTime = searchParams?.get('time') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)
  const purposesArr = formatStringToArray(queryPurposes)

  const [routeList, setRouteList] = useState<Record<string, TmapPoiItem[]>>({
    meal: [],
    coffee: [],
    pharmacy: [],
    shopping: [],
  })

  const { idx, initialIdx } = useRoutePlaceIdxStore()
  const position = usePositionStore(state => state.position)

  // 장소 데이터 가져와 캐싱처리하기
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
    if (typeof window === undefined) return
    if (!position) return
    if (data === undefined) return

    // alert('2 : ' + btnStatusRef.current)
    const getData = () => {
      const filterApiArr = filterApiData(data)

      const formatApiData = formatResult(purposesArr, filterApiArr)
      const listArr = { meal: [], coffee: [], pharmacy: [], shopping: [] }
      // addValueByCategory(setRouteList, purposesArr, formatApiData)
      addValueByCategory(listArr, formatApiData)

      setRouteList(listArr)
      // return result
    }
    initialIdx()
    getData()
    // alert('btnStatus : ' + btnStatus)
  }, [data])

  const routeArr = [
    routeList.meal[idx] ?? routeList.meal[0],
    routeList.coffee[idx] ?? routeList.coffee[0],
    routeList.pharmacy[idx] ?? routeList.pharmacy[0],
    routeList.shopping[idx] ?? routeList.shopping[0],
  ].filter(Boolean) // undefined 제거

  const routeArrInitial = [
    routeList.meal[0],
    routeList.coffee[0],
    routeList.pharmacy[0],
    routeList.shopping[0],
  ].filter(Boolean) // undefined 제거

  const routeArrSize = [
    routeList.meal.length,
    routeList.coffee.length,
    routeList.pharmacy.length,
    routeList.shopping.length,
  ].filter(Boolean) // undefined 제거

  const resultRouteArr = routeArrInitial.length

  const prevPathRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  function validatePath(lat: number, lon: number) {
    const prev = prevPathRef.current
    if (lat === prev.x && lon === prev.y) return false

    prev.x = lat
    prev.y = lon
    return true
  }

  const requestIdRef = useRef(0) // 요청 번호 발급기
  const latestRequestIdRef = useRef(0) // 마지막 요청 번호

  const [isDisabled, setIsDisabled] = useState(false)

  const getPositionFromStorage = () => {
    if (typeof window === 'undefined') return null
    const v = localStorage.getItem('poi-cache')
    return v ? JSON.parse(v) : null
  }

  function drawMarker(lat: number, lon: number, placeName: string | undefined) {
    const position = getPositionFromStorage()

    const x = position.coords.longitude
    const y = position.coords.latitude

    const requestId = ++requestIdRef.current
    latestRequestIdRef.current = requestId
    if (!validatePath(lat, lon)) return
    if (isDisabled) return
    setIsDisabled(true)

    setTimeout(() => {
      if (requestId !== latestRequestIdRef.current) return

      const map = onLoadMarkerMap({ x: lat, y: lon })
      const mapResultSignal = goalMarker(map, { x: lon, y: lat })
      const mapStartSignal = startMarker(map, { x: x, y: y })
      const mapPolyLine = getPathWalk(
        map,
        { x: x, y: y },
        { x: lon, y: lat },
        placeName || initialPlaceObj.name,
      )

      if (mapResultSignal != null && mapPolyLine != null) setIsDisabled(false)
    }, 700)
  }

  function drawPolyLine(
    map: naver.maps.Map,
    path: tmapRoutePathType,
    polyLine: (map: naver.maps.Map, path: [[number, number]]) => void,
  ) {
    polyLine(map, path.path)
  }

  async function getPathWalk(
    map: naver.maps.Map,
    startInfoState: startRouteType,
    goalInfoState: goalRouteType,
    placeName: string,
  ) {
    const requestData = {
      startX: startInfoState.x,
      startY: startInfoState.y,
      endX: goalInfoState.x,
      endY: goalInfoState.y,
      // passList: '경도,위도_경도,위도_경도,위도',
      reqCoordType: 'WGS84GEO',
      resCoordType: 'WGS84GEO',
      startName: encodeURIComponent('내 위치'),
      // startName: startInfoState.start.name,
      endName: encodeURIComponent(placeName),
    }

    // const path = await getPathWalking(requestData)
    const res = await fetch('/api/walking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    const path = await res.json()

    drawPolyLine(map, path, setWalkPolyLine)
  }

  return (
    <React.Fragment>
      {/* <div> */}
      {isDisabled && (
        <div className="absolute top-0 w-full ">
          <div className=" grid  h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
            <FindingPlaceSpinner />
          </div>
          {/* 루트 정보 카드 - StatValue & StatLabel 컴포넌트 사용 */}
        </div>
      )}
      {resultRouteArr > 0 ? (
        <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
          {routeArr.map((place: placeType | null, index: number) => (
            <button
              key={index + 1}
              disabled={isDisabled}
              onClick={() =>
                drawMarker(
                  Number(place?.pnsLat),
                  Number(place?.pnsLon),
                  place?.name,
                )
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
                          {place?.newAddressList.newAddress[0].fullAddressRoad}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon.Clock className="w-4 h-4" />
                        <span>
                          {getHourTimeMinTimeFormat(Number(place?.radius))
                            .hours > 0
                            ? `${getHourTimeMinTimeFormat(
                                Number(place?.radius),
                              ).hours.toString()}시간 ${getHourTimeMinTimeFormat(
                                Number(place?.radius),
                              ).minutes.toString()}분`
                            : `${getHourTimeMinTimeFormat(
                                Number(place?.radius),
                              ).minutes.toString()}분`}{' '}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </React.Fragment>
  )
}
// const [startSummaryState, setStartSummaryStateInternal] = useState<{
//   pathArr: [[number, number]]
//   distance: number
//   duration: number
//   method: string
// } | null>(null)

// const setStartSummaryState = (arg0: {
//   pathArr: [[number, number]]
//   distance: number
//   duration: number
//   method: string
// }) => {
//   setStartSummaryStateInternal(arg0)
// }
