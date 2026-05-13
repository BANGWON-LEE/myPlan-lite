import { placeType } from '@/types/placeType'
import { useRoutePlaceBtn } from '../../../ui/RoutePlaceBtn/RoutePlaceBtn.logic'
import { RoutePlaceBtn } from '../../../ui/RoutePlaceBtn/RoutePlaceBtn'

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
