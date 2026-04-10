'use client'
import MapScript from '@/components/MapScript'
import {
  useMapStore,
  usePositionStore,
  useRoutePathStore,
  useStartPointStore,
} from '@/stores/useRouteStore'
import { RouteMapProps } from '@/types/routeType'
import { savePositionToStorage } from '@/util/storage/positionStorage'
import { useEffect, useRef, useState } from 'react'
import {
  drawRouteByPoints,
  getDrawMyMarker,
} from '../containers/drawRouteContainer'

export default function RouteMap({
  position,
  selectedRoutePoints,
}: RouteMapProps) {
  const map = useMapStore(state => state.map)

  const setPosition = usePositionStore(state => state.setPosition)
  useEffect(() => {
    if (!position) return
    setPosition(position)
    savePositionToStorage(position)
  }, [position, setPosition])

  const isMapReady = usePositionStore(state => state.position) !== null
  const routePath = useRoutePathStore(state => state.path)
  const startPoint = useStartPointStore(state => state.startPoint)

  const [errorMesage, setErrorMessage] = useState<string | null>(null)

  const watchIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isMapReady) return
    if (!map) return
    if (!routePath) return
    if (!startPoint) return
    console.log('지도와 위치 준비 완료, 위치 추적 시작', map)
    // console.log('현재 위치 업데이트:', latLng.toString())

    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => {
        const movingPoint = {
          x: pos.coords.longitude,
          y: pos.coords.latitude,
          name: '현재 위치',
        }
        getDrawMyMarker(map, movingPoint, movingPoint.name)
      },
      err => {
        console.error(err)
        setErrorMessage(
          '현재 위치를 가져오는 데 실패했습니다. 위치 권한을 확인해주세요.',
        )
      },
      { enableHighAccuracy: true, maximumAge: 4000, timeout: 800 },
    )

    // const path = await drawRouteByPoints(map, selectedRoutePoints, startPoint)
    // setRoutePath(path)
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [isMapReady, map, routePath, selectedRoutePoints, startPoint])

  return (
    <>
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
        <MapScript />
        <div className="absolute inset-0 flex items-center justify-center">
          <div id="map" className="w-full h-full"></div>
        </div>
        <div>
          <p>{errorMesage}</p>
        </div>
      </div>
    </>
  )
}
