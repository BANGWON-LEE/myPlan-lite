'use client'

import { onLoadRouteMap } from '@/util/map/mapFunctions'
import Script from 'next/script'
import { useEffect } from 'react'

export default function MapScript() {
  const getPositionFromStorage = () => {
    if (typeof window === 'undefined') return null
    const v = localStorage.getItem('poi-cache')
    return v ? JSON.parse(v) : null
  }
  useEffect(() => {
    if (!window.naver) return
    const pos = getPositionFromStorage()
    if (!pos) return
    // onLoadRouteMap(pos, map)
    // onLoadMap(pos)
    onLoadRouteMap(
      pos,
      new naver.maps.Map('map', {
        center: new naver.maps.LatLng(
          37.5665, // 서울
          126.978
        ),
        zoom: 14,
        mapTypeId: naver.maps.MapTypeId.NORMAL,
      })
    )
  }, [])

  return (
    <>
      {/* <Head>
        <link
          rel="preconnect"
          as="script"
          href={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        />
        <link
          rel="preconnect"
          as="script"
          href={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        />
      </Head> */}

      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        strategy="afterInteractive"
        onLoad={() => {
          // console.log('fefe')
          const pos = getPositionFromStorage()
          onLoadRouteMap(
            pos,
            new naver.maps.Map('map', {
              center: new naver.maps.LatLng(
                37.5665, // 서울
                126.978
              ),
              zoom: 14,
              mapTypeId: naver.maps.MapTypeId.NORMAL,
            })
          )
        }}
      ></Script>
    </>
  )
}
