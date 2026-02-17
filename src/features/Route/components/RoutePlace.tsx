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
  getCurrentPositionPromise,
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

  const [routeList, setRouteList] = useState<Record<string, TmapPoiItem[]>>({
    meal: [],
    coffee: [],
    pharmacy: [],
    shopping: [],
  })

  const {
    mealIdx,
    coffeeIdx,
    pharmacyIdx,
    shoppingIdx,
    incMealIdx,
    incCoffeeIdx,
    incPharmacyIdx,
    incShoppingIdx,
    initialIdx,
  } = useRoutePlaceIdxStore() // 각 카테고리 별로 장소를 다르게 보여주려 함

  const position = usePositionStore(state => state.position)

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

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!position) return
    if (data === undefined) return

    const getData = () => {
      const purposesArr = formatStringToArray(queryPurposes)
      const filterApiArr = filterApiData(data)

      const formatApiData = formatResult(purposesArr, filterApiArr)
      const listArr = { meal: [], coffee: [], pharmacy: [], shopping: [] }
      addValueByCategory(listArr, formatApiData)

      setRouteList(listArr)
    }
    initialIdx()
    getData()
  }, [data, initialIdx, position, queryPurposes])

  // 각 장소별 인덱스를 배열로 관리
  const routePlaceIdxList = [mealIdx, coffeeIdx, pharmacyIdx, shoppingIdx]

  //각 장소별 인덱스 증가 함수를 배열로 관리
  // const routePlaceActionList = {
  //   meal: incMealIdx(),
  //   coffee: incCoffeeIdx(),
  //   pharmacy: incPharmacyIdx(),
  //   shopping: incShoppingIdx(),
  // }

  function changeRoutePlaceIdx(list: string) {
    switch (list) {
      case 'meal':
        incMealIdx()
        break
      case 'coffee':
        incCoffeeIdx()
        break
      case 'pharmacy':
        incPharmacyIdx()
        break
      case 'shopping':
        incShoppingIdx()
        break
      default:
        break
    }
  }

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
  ]

  const resultRouteArrSize = routeArrInitial.length

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

  // localStorage 값이 GeolocationPosition 형태인지 최소 필드만 검증한다.
  function isValidPositionData(
    value: unknown,
  ): value is { coords: { latitude: number; longitude: number } } {
    if (!value || typeof value !== 'object') return false

    const coords = (value as { coords?: unknown }).coords
    if (!coords || typeof coords !== 'object') return false

    const latitude = (coords as { latitude?: unknown }).latitude
    const longitude = (coords as { longitude?: unknown }).longitude

    return typeof latitude === 'number' && typeof longitude === 'number'
  }

  // 저장된 poi-cache를 안전하게 파싱하고, 유효하지 않으면 null을 반환한다.
  const getPositionFromStorage = (): GeolocationPosition | null => {
    if (typeof window === 'undefined') return null

    try {
      const v = localStorage.getItem('poi-cache')
      if (!v) return null

      const parsedValue: unknown = JSON.parse(v)
      if (!isValidPositionData(parsedValue)) return null

      return parsedValue as GeolocationPosition
    } catch {
      return null
    }
  }

  // 캐시 우선 사용, 실패 시 현재 위치를 조회해 캐시를 복구한다.
  async function getPositionWithFallback(): Promise<GeolocationPosition | null> {
    const cachedPosition = getPositionFromStorage()
    if (cachedPosition) return cachedPosition

    if (typeof window === 'undefined' || !navigator.geolocation) return null

    try {
      const currentPosition = await getCurrentPositionPromise()
      // 이후 경로 탐색에서 동일 값을 재사용할 수 있도록 캐시에 저장한다.
      localStorage.setItem('poi-cache', JSON.stringify(currentPosition))
      return currentPosition
    } catch {
      return null
    }
  }

  async function drawMarker(
    lat: number,
    lon: number,
    placeName: string | undefined,
  ) {
    // 캐시 누락/오염을 fallback으로 복구한 뒤에만 좌표 접근한다.
    const position = await getPositionWithFallback()
    if (!position) return

    const currentX = position.coords.longitude
    const currentY = position.coords.latitude

    const requestId = ++requestIdRef.current
    latestRequestIdRef.current = requestId
    if (!validatePath(lat, lon)) return
    if (isDisabled) return
    setIsDisabled(true)
    setTimeout(() => {
      onDrawMarkerLine(requestId, lat, lon, currentX, currentY, placeName)
    }, 1000)
  }

  function onDrawMarkerLine(
    requestId: number,
    lat: number,
    lon: number,
    currentX: number,
    currentY: number,
    placeName: string | undefined,
  ) {
    if (requestId !== latestRequestIdRef.current) return

    const map = onLoadMarkerMap({ x: lat, y: lon })
    const mapStartSignal = startMarker(map, { x: currentX, y: currentY })
    const mapResultSignal = goalMarker(map, { x: lon, y: lat })

    const mapPolyLine = getPathWalk(
      map,
      { x: currentX, y: currentY },
      { x: lon, y: lat },
      placeName || initialPlaceObj.name,
    )

    const mapLoadCheck =
      mapStartSignal !== null &&
      mapResultSignal !== null &&
      mapPolyLine !== null

    if (mapLoadCheck) setIsDisabled(false)
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

  // const { incIdx } = useRoutePlaceIdxStore()

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
      {resultRouteArrSize > 0 ? (
        <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
          {routeArr.map(
            (place: { key: string; list: placeType | null }, index: number) => (
              <>
                {place.list?.name !== undefined && (
                  <section key={index + 1} className="w-full">
                    <div
                      className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex ${
                        routeArrSize[index] <= routePlaceIdxList[index] &&
                        'bg-slate-300'
                      }`}
                    >
                      <div className="flex w-3/4">
                        {/* <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-purple-100"></div> */}
                        <div className="flex-1 p-4">
                          <div className="flex w-full items-start justify-between mb-2">
                            <div className="w-full grid text-left">
                              <span className="text-sm font-semibold text-red-500">
                                {/* {routeArr[index].name !== place?.name && */}
                                {routeArrSize[index] <=
                                  routePlaceIdxList[index] &&
                                  '더 이상 추천할 장소가 없습니다'}
                              </span>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-indigo-600">
                                  #{index + 1}
                                </span>
                                <h3 className="font-bold text-gray-900">
                                  {place.list?.name}
                                </h3>
                              </div>
                              {/* StatLabel 컴포넌트 사용 */}
                              <StatLabel>{place.list?.middleBizName}</StatLabel>
                            </div>
                          </div>
                          <div className="grid items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Icon.Phone className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span>{place.list?.telNo}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon.MapPin className="w-4 h-4" />
                              <span>
                                {
                                  place.list?.newAddressList.newAddress[0]
                                    .fullAddressRoad
                                }
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon.Clock className="w-4 h-4" />
                              <span>
                                {getHourTimeMinTimeFormat(
                                  Number(place.list?.radius),
                                ).hours > 0
                                  ? `${getHourTimeMinTimeFormat(
                                      Number(place.list?.radius),
                                    ).hours.toString()}시간 ${getHourTimeMinTimeFormat(
                                      Number(place.list?.radius),
                                    ).minutes.toString()}분`
                                  : `${getHourTimeMinTimeFormat(
                                      Number(place.list?.radius),
                                    ).minutes.toString()}분`}{' '}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-1/4 grid  ">
                        <button
                          className="h-full  w-full bg-slate-200"
                          disabled={isDisabled}
                          onClick={() =>
                            drawMarker(
                              Number(place.list?.pnsLat),
                              Number(place.list?.pnsLon),
                              place.list?.name,
                            )
                          }
                        >
                          <div className="text-indigo-600 font-semibold">
                            경로 찾기
                          </div>
                        </button>
                        <button
                          onClick={() => changeRoutePlaceIdx(place.key)}
                          className="h-full  w-full bg-amber-200"
                        >
                          <div className="text-amber-600 font-semibold">
                            다른 장소
                          </div>
                        </button>
                      </div>
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
