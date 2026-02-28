'use client'

import { usePositionStore } from '@/stores/useRouteStore'
import { onLoadRouteMap } from '@/util/map/mapFunctions'
import Script from 'next/script'

export default function MapScript() {
  return (
    <>
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        strategy="afterInteractive"
        onLoad={() => {
          try {
            const pos = usePositionStore.getState().position
            onLoadRouteMap(
              new naver.maps.Map('map', {
                center: new naver.maps.LatLng(
                  pos ? pos.coords.latitude : 37.5665,
                  pos ? pos.coords.longitude : 126.978,
                ),
                zoom: 14,
                mapTypeId: naver.maps.MapTypeId.NORMAL,
              }),
            )
          } catch (error) {
            // 전역으로 가져오는 좌표값에 문제가 생길 때, localStorage에서 좌표값을 가져와 fallback으로 사용한다.
            console.error('Error loading Naver Map:', error)
            const pos = localStorage.getItem('position')
            onLoadRouteMap(
              new naver.maps.Map('map', {
                center: new naver.maps.LatLng(
                  pos ? JSON.parse(pos).coords.latitude : 37.5665,
                  pos ? JSON.parse(pos).coords.longitude : 126.978,
                ),
                zoom: 14,
                mapTypeId: naver.maps.MapTypeId.NORMAL,
              }),
            )
          }
        }}
      ></Script>
    </>
  )
}
