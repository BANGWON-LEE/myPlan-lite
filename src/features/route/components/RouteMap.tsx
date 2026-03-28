'use client'
import MapScript from '@/components/MapScript'
import {
  startGpsWatch,
  toGeolocationPosition,
} from '@/features/route/containers/gpsMoveContainer'
import { usePositionStore } from '@/stores/useRouteStore'
import { MapScriptProps } from '@/types/placeType'
import { savePositionToStorage } from '@/util/storage/positionStorage'
import { useEffect, useRef } from 'react'

export default function RouteMap(props: MapScriptProps) {
  const { position } = props

  const setPosition = usePositionStore(state => state.setPosition)
  const stopGpsWatchRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!position) return
    setPosition(position)
    savePositionToStorage(position)
  }, [position, setPosition])

  useEffect(() => {
    stopGpsWatchRef.current?.()
    stopGpsWatchRef.current = startGpsWatch({
      onCoordinateUpdate: (coordinate, timestamp) => {
        const nextPosition = toGeolocationPosition(coordinate, timestamp)
        setPosition(nextPosition)
        savePositionToStorage(nextPosition)
      },
    })

    return () => {
      stopGpsWatchRef.current?.()
      stopGpsWatchRef.current = null
    }
  }, [setPosition])

  return (
    <>
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
        <MapScript />
        <div className="absolute inset-0 flex items-center justify-center">
          <div id="map" className="w-full h-full"></div>
        </div>
        {/* 루트 정보 카드 - StatValue & StatLabel 컴포넌트 사용 */}
      </div>
      <div
        id="gps-status-message"
        className="min-h-5 px-1 pt-2 text-xs text-amber-700"
      ></div>
    </>
  )
}
