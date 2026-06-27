'use client'

import { RoutePlaceBtn } from '@/features/ui/RoutePlaceBtn/RoutePlaceBtn'
import { useRoutePlaceBtn } from '@/features/ui/RoutePlaceBtn/RoutePlaceBtn.logic'
import { StatLabel } from '@/share/components/Text'
import { placeType } from '@/types/placeType'
import { getHourTimeMinTimeFormat } from '@/util/common/common'
import { Clock, MapPin, Phone } from 'lucide-react'

export default function RoutePlaceList(props: {
  index: number
  place: { key: string; list: placeType | null }
  isDisabled: boolean
  routeArrSize: number
  routePlaceIdxList: number
}) {
  const { index, place, isDisabled, routeArrSize, routePlaceIdxList } = props

  const routePlaceBtn = useRoutePlaceBtn(index, place, isDisabled)

  const cardNum = (index + 1).toString().padStart(2, '0') // 1 -> "01", 2 -> "02", ..., 10 -> "10"

  function convertRadiusToMeter(radius?: string | number) {
    if (!radius) return 0

    return Math.round(Number(radius) * 1000)
  }

  const formatRadius = convertRadiusToMeter(place.list?.radius)

  const time =
    getHourTimeMinTimeFormat(Number(formatRadius)).hours > 0
      ? `${getHourTimeMinTimeFormat(
          Number(formatRadius),
        ).hours.toString()}시간 ${getHourTimeMinTimeFormat(
          Number(formatRadius),
        ).minutes.toString()}분`
      : `${getHourTimeMinTimeFormat(Number(formatRadius)).minutes.toString()}분`

  return (
    <RoutePlaceBtn {...routePlaceBtn}>
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
                  #{cardNum}
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
              <span>도보 거리 {formatRadius.toLocaleString()}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
          </div>
        </div>
      </div>
    </RoutePlaceBtn>
  )
}
