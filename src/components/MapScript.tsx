'use client'

import { onLoadMap } from '@/util/map/mapFunctions'
import Script from 'next/script'
import { useEffect, useLayoutEffect } from 'react'

export default function MapScript() {
  return (
    <Script
      type="text/javascript"
      src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
      // strategy="afterInteractive"
      onLoad={() => {
        new naver.maps.Map('map', {
          center: new naver.maps.LatLng(
            37.5665, // 서울
            126.978
          ),
          zoom: 14,
          mapTypeId: naver.maps.MapTypeId.NORMAL,
        })
      }}
    ></Script>
  )
}
