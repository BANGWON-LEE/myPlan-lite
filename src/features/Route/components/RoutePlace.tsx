'use client'
import dynamic from 'next/dynamic'
import { StatLabel, StatValue } from '@/share/components/Text'
import { placeType, TmapPoiItem } from '@/types/placeType'
import {
  addValueByCategory,
  filterApiData,
  formatResult,
  formatStringToArray,
  getHourTimeMinTimeFormat,
} from '@/util/common/common'
import { getCurrentPositionPromise } from '@/util/map/mapFunctions'

const Icon = {
  Phone: dynamic(() => import('lucide-react').then(m => m.Phone)),
  Clock: dynamic(() => import('lucide-react').then(m => m.Clock)),
  MapPin: dynamic(() => import('lucide-react').then(m => m.MapPin)),
}

// import { Clock, MapPin, Phone } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getMyRouteList } from '../containers/RouteMainContainer'
import LoadingScreen from '@/features/loading/components/LoadingScreen'
import { useRoutePlaceIdxStore } from '@/stores/useRouteStore'
// import LoadingScreen from '@/features/loading/components/LoadingScreen'

export default function RoutePlace() {
  const searchParams = useSearchParams()
  const queryPurposes = searchParams?.get('purposes') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)
  const queryTime = searchParams?.get('time') ?? '' // ?text=카페 → "카페" (fallback to empty string if null)

  const [routeList, setRouteList] = useState<Record<string, TmapPoiItem[]>>({
    meal: [],
    coffee: [],
    walk: [],
    shopping: [],
  })

  const { idx, initialIdx } = useRoutePlaceIdxStore()
  // console.log('111')

  useEffect(() => {
    const getData = async () => {
      // console.log('queryPurposes', queryPurposes)
      const purposesArr = formatStringToArray(queryPurposes)
      const position = await getCurrentPositionPromise()

      // console.log('purposesArr@', purposesArr)

      const apiArr = await getMyRouteList(position, purposesArr, queryTime)
      const filterApiArr = filterApiData(apiArr)
      // console.log('filterApiArr', filterApiArr)
      const formatApiData = formatResult(purposesArr, filterApiArr)
      const listArr = { meal: [], coffee: [], walk: [], shopping: [] }
      // addValueByCategory(setRouteList, purposesArr, formatApiData)
      addValueByCategory(listArr, formatApiData)
      // console.log('divideList', divideList)
      setRouteList(listArr)
      // return result
    }
    initialIdx()
    getData()
  }, [])

  // const routeArr = [
  //   routeList.meal[idx],
  //   routeList.coffee[idx],
  //   routeList.walk[idx],
  //   routeList.shopping[idx],
  // ].filter(Boolean) // undefined 제거
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
              <div
                key={index + 1}
                className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  routeArrSize[index] <= idx && 'bg-slate-300'
                }`}
              >
                <div className="flex">
                  {/* <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-purple-100"></div> */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
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
            )
          )}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </React.Fragment>
  )
}
