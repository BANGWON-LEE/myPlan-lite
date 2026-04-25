'use client'

import { useMapStore, usePositionStore } from '@/stores/useRouteStore'
import { DEFAULT_MAP_ZOOM } from '@/util/map/mapFunctions'
import Script from 'next/script'
import { useEffect } from 'react'

export default function MapScript() {
  const position = usePositionStore(state => state.position)
  const setMap = useMapStore(state => state.setMap)

  function handleMapLoad() {
    try {
      const pos = usePositionStore.getState().position
      const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(
          pos?.coords.latitude ?? 37.5665,
          pos?.coords.longitude ?? 126.978,
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
          pos ? JSON.parse(pos).coords.latitude : 37.5665,
          pos ? JSON.parse(pos).coords.longitude : 126.978,
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
  }, [position, setMap])

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
