'use client'
import MapScript from '@/components/MapScript'
import { onLoadMap } from '@/util/map/mapFunctions'
import { useEffect, useRef } from 'react'

export default function RouteMap() {
  const mapRef = useRef(null)

  useEffect(() => {
    if (mapRef.current)
      navigator.geolocation.getCurrentPosition(pos => {
        onLoadMap(pos)
      })
  }, [mapRef])

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
