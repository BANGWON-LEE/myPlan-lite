'use client'
import MapScript from '@/components/MapScript'
import { usePositionStore } from '@/stores/useRouteStore'
import { MapScriptProps } from '@/types/placeType'
import { throttle } from '@/util/common/throttle'
import { savePositionToStorage } from '@/util/storage/positionStorage'
import { useEffect, useRef } from 'react'

const UPDATE_THROTTLE_MS = 4000
const MIN_POSITION_UPDATE_DISTANCE_METERS = 10

function getDistanceMeters(
  prev: GeolocationPosition,
  next: GeolocationPosition,
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const earthRadiusMeters = 6371000
  const lat1 = prev.coords.latitude
  const lon1 = prev.coords.longitude
  const lat2 = next.coords.latitude
  const lon2 = next.coords.longitude
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusMeters * c
}

export default function RouteMap(props: MapScriptProps) {
  const { position } = props

  const setPosition = usePositionStore(state => state.setPosition)
  const watchIdRef = useRef<number | null>(null)
  const lastAcceptedPositionRef = useRef<GeolocationPosition | null>(null)

  const setGpsStatusMessage = (message: string) => {
    const messageContainer = document.getElementById('gps-status-message')
    if (!messageContainer) return
    messageContainer.innerHTML = message
  }

  useEffect(() => {
    if (!position) return
    setPosition(position)
    savePositionToStorage(position)
    lastAcceptedPositionRef.current = position
  }, [position, setPosition])

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatusMessage('gps를 지원하지 않는 환경입니다.')
      return
    }

    const commitPosition = (nextPosition: GeolocationPosition) => {
      setPosition(nextPosition)
      savePositionToStorage(nextPosition)
      lastAcceptedPositionRef.current = nextPosition
      setGpsStatusMessage('')
    }

    const throttledCommitPosition = throttle(
      (nextPosition: GeolocationPosition) => {
        const prevPosition = lastAcceptedPositionRef.current
        if (!prevPosition) {
          commitPosition(nextPosition)
          return
        }

        const distanceMeters = getDistanceMeters(prevPosition, nextPosition)
        if (distanceMeters < MIN_POSITION_UPDATE_DISTANCE_METERS) {
          return
        }

        commitPosition(nextPosition)
      },
      UPDATE_THROTTLE_MS,
    )

    const onPositionUpdate = (nextPosition: GeolocationPosition) => {
      throttledCommitPosition(nextPosition)
    }

    const onPositionError = () => {
      setGpsStatusMessage('gps가 불안정하여 위치가 변화되지 않습니다.')
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      onPositionUpdate,
      onPositionError,
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 5000,
      },
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }

      throttledCommitPosition.cancel()
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
