'use client'

import { onLoadMap } from '@/util/map/mapFunctions'
import Script from 'next/script'
import { useEffect } from 'react'

export default function MapScript() {
  useEffect(() => {
    // console.log('222')
    if (window.naver?.maps) {
      navigator.geolocation.getCurrentPosition(pos => {
        onLoadMap(pos)
      })
    }
  }, [])
  return (
    <Script
      type="text/javascript"
      src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
      strategy="afterInteractive"
      onLoad={() => {
        navigator.geolocation.getCurrentPosition(pos => {
          onLoadMap(pos)
        })
      }}
    ></Script>
  )
}
