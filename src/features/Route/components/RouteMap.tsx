'use client'
import MapScript from '@/components/MapScript'
import { onLoadMap } from '@/util/map/mapFunctions'
import { useEffect, useRef } from 'react'

export default function RouteMap() {
  const mapRef = useRef(null)

  const cachedPos = useRef<CachedLocation | null>(null)

  function nowStatusCached(now: number) {
    if (
      mapRef.current &&
      cachedPos.current &&
      now - cachedPos.current.timestamp < 60_000
    ) {
      onLoadMap(cachedPos.current.pos)
      return true
    }
    return false
  }

  function getLocation() {
    const now = Date.now()

    // 1분 이내면 캐시 사용
    if (nowStatusCached(now)) return

    navigator.geolocation.getCurrentPosition(
      pos => {
        cachedPos.current = { pos, timestamp: now }
        onLoadMap(pos)
      },
      console.error,
      {
        enableHighAccuracy: false,
        maximumAge: 60000,
        timeout: 2000,
      }
    )
  }

  useEffect(() => {
    getLocation()
  }, [mapRef])

  type CachedLocation = {
    pos: GeolocationPosition
    timestamp: number
  }

  return (
    <>
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
        <MapScript />
        <div className="absolute inset-0 flex items-center justify-center">
          <div id="map" ref={mapRef} className="w-full h-full"></div>
        </div>

        {/* 루트 정보 카드 - StatValue & StatLabel 컴포넌트 사용 */}
      </div>
    </>
  )
}
