'use client'

import { StatLabel } from '@/share/components/Text'
import { useRoutePathStore } from '@/stores/useRouteStore'
import { placeType } from '@/types/placeType'
import { getHourTimeMinTimeFormat } from '@/util/common/common'
import { Clock, MapPin, Phone } from 'lucide-react'

export default function RoutePlaceList(props: {
  place: { key: string; list: placeType | null }
  routeArrSize: number
  routePlaceIdxList: number
}) {
  const { place, routeArrSize, routePlaceIdxList } = props
  const placeDistance = useRoutePathStore(
    state => state.path?.summary.properties,
  )?.totalDistance

  // console.log('RoutePlaceList - totalDistance:', totalDistance)

  const time =
    getHourTimeMinTimeFormat(Number(place.list?.radius)).hours > 0
      ? `${getHourTimeMinTimeFormat(
          Number(placeDistance),
        ).hours.toString()}시간 ${getHourTimeMinTimeFormat(
          Number(placeDistance),
        ).minutes.toString()}분`
      : `${getHourTimeMinTimeFormat(Number(placeDistance)).minutes.toString()}분`

  const listNum = routePlaceIdxList <= routeArrSize ? routePlaceIdxList + 1 : 1

  return (
    <div className="flex w-3/4">
      <div className="flex-1 p-4">
        <div className="flex w-full items-start justify-between mb-2">
          <div className="w-full grid text-left">
            <span className="text-sm font-semibold text-red-500">
              {routeArrSize <= routePlaceIdxList &&
                '더 이상 추천할 장소가 없습니다'}
            </span>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-indigo-600">
                #{listNum}
              </span>
              <h3 className="font-bold text-gray-900">{place.list?.name}</h3>
            </div>
            {/* StatLabel 컴포넌트 사용 */}
            <StatLabel>{place.list?.middleBizName}</StatLabel>
          </div>
        </div>
        <div className="grid items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{place.list?.telNo}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>
              {place.list?.newAddressList.newAddress[0].fullAddressRoad}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <span>도보 거리 {placeDistance?.toLocaleString()}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
