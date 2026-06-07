'use client'

import { useMapStore } from '@/stores/useRouteStore'
import { DEFAULT_MAP_ZOOM } from '@/util/map/mapFunctions'
import Script from 'next/script'
import { useEffect } from 'react'

export default function MapScript({
  position,
}: {
  position: GeolocationPosition | null
}) {
  const setMap = useMapStore(state => state.setMap)

  function handleMapLoad() {
    try {
      const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(
          position?.coords.latitude ?? 37.5665,
          position?.coords.longitude ?? 126.978,
        ),
        zoom: DEFAULT_MAP_ZOOM,
        mapTypeId: naver.maps.MapTypeId.NORMAL,
      })
      setMap(map)
    } catch (error) {
      // 전역으로 가져오는 좌표값에 문제가 생길 때, localStorage에서 좌표값을 가져와 fallback으로 사용한다.
      console.error('Error loading Naver Map:', error)
      const pos = localStorage.getItem('position')
      const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(
          position?.coords.latitude ??
            (pos ? JSON.parse(pos).coords.latitude : 37.5665),
          position?.coords.longitude ??
            (pos ? JSON.parse(pos).coords.longitude : 126.978),
        ),
        zoom: DEFAULT_MAP_ZOOM,
        mapTypeId: naver.maps.MapTypeId.NORMAL,
      })
      setMap(map)
    }
  }

  useEffect(() => {
    if (typeof naver === 'undefined') return
    handleMapLoad()
  }, [])

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        strategy="lazyOnload"
        onLoad={() => handleMapLoad()}
      ></Script>
    </>
  )
}
