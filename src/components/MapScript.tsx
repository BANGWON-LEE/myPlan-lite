'use client'

import Head from 'next/head'
import Script from 'next/script'

export default function MapScript() {
  return (
    <>
      <Head>
        <link
          rel="preload"
          as="script"
          href={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        />
      </Head>

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
    </>
  )
}
