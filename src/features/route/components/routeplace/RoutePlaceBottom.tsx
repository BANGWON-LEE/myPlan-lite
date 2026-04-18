import { useRoutePlaceIdxStore } from '@/stores/useRouteStore'
import { placeType } from '@/types/placeType'
import { useState } from 'react'
import { useRoutePlaceBtn } from '../RoutePlaceBtn/RoutePlaceBtn.logic'
import { Route } from 'lucide-react'
import { RoutePlaceBtn } from '../RoutePlaceBtn/RoutePlaceBtnView'

export default function RoutePlaceBottom(props: {
  place: { key: string; list: placeType | null }
  placeList: placeType[]
  currentIdx: number
  isDisabled: boolean
}) {
  const { currentIdx, isDisabled, place, placeList } = props

  const routePlaceBtn = useRoutePlaceBtn(
    placeList,
    currentIdx,
    place,
    isDisabled,
  )

  return (
    <div className="w-1/4 grid">
      <RoutePlaceBtn {...routePlaceBtn}>
        {routePlaceBtn.searchErrorMessage
          ? routePlaceBtn.searchErrorMessage
          : '다른 장소 검색'}
      </RoutePlaceBtn>
    </div>
  )
}
