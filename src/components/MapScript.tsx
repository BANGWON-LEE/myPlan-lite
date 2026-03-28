'use client'

import { usePositionStore } from '@/stores/useRouteStore'
import {
  createLatLng,
  DEFAULT_MAP_ZOOM,
  onLoadRouteMap,
} from '@/util/map/mapFunctions'
import Script from 'next/script'
import { useEffect } from 'react'

export default function MapScript() {
  const position = usePositionStore(state => state.position)

  function handleMapLoad() {
    try {
      const pos = usePositionStore.getState().position
      onLoadRouteMap(
        new naver.maps.Map('map', {
          center: createLatLng(
            pos?.coords.latitude ?? 37.5665,
            pos?.coords.longitude ?? 126.978,
          ),
          zoom: DEFAULT_MAP_ZOOM,
          mapTypeId: naver.maps.MapTypeId.NORMAL,
        }),
      )
    } catch (error) {
      // 전역으로 가져오는 좌표값에 문제가 생길 때, localStorage에서 좌표값을 가져와 fallback으로 사용한다.
      console.error('Error loading Naver Map:', error)
      const pos = localStorage.getItem('position')
      onLoadRouteMap(
        new naver.maps.Map('map', {
          center: createLatLng(
            pos ? JSON.parse(pos).coords.latitude : 37.5665,
            pos ? JSON.parse(pos).coords.longitude : 126.978,
          ),
          zoom: DEFAULT_MAP_ZOOM,
          mapTypeId: naver.maps.MapTypeId.NORMAL,
        }),
      )
    }
  }

  useEffect(() => {
    if (typeof naver === 'undefined') return
    handleMapLoad()
  }, [position])

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
