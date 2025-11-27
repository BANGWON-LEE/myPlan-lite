'use client'
import MapScript from '@/components/MapScript'
import { onLoadMap } from '@/util/map/mapFunctions'
import React, { useEffect } from 'react'

export default function RouteMap() {
  return (
    <React.Fragment>
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
        <MapScript />
        <div className="absolute inset-0 flex items-center justify-center">
          <div id="map" className="w-full h-full"></div>
        </div>

        {/* 루트 정보 카드 - StatValue & StatLabel 컴포넌트 사용 */}
      </div>
    </React.Fragment>
  )
}
