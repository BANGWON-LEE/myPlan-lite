'use client'

import { usePositionStore } from '@/stores/useRouteStore'
import {
  createLatLng,
  DEFAULT_MAP_ZOOM,
  getRouteMapInstance,
  setRouteMapInstance,
} from '@/util/map/mapFunctions'
import Script from 'next/script'
import { useEffect, useRef } from 'react'

export default function MapScript() {
  const position = usePositionStore(state => state.position)
  const isMapInitializedRef = useRef(false)

  function handleMapLoad() {
    if (isMapInitializedRef.current) return
    const existingMap = getRouteMapInstance()
    if (existingMap) {
      isMapInitializedRef.current = true
      return
    }

    try {
      const pos = usePositionStore.getState().position
      const map = new naver.maps.Map('map', {
        center: createLatLng(
          pos?.coords.latitude ?? 37.5665,
          pos?.coords.longitude ?? 126.978,
        ),
        zoom: DEFAULT_MAP_ZOOM,
        mapTypeId: naver.maps.MapTypeId.NORMAL,
      })
      setRouteMapInstance(map)
      isMapInitializedRef.current = true
    } catch (error) {
      // 전역으로 가져오는 좌표값에 문제가 생길 때, localStorage에서 좌표값을 가져와 fallback으로 사용한다.
      console.error('Error loading Naver Map:', error)
      const pos = localStorage.getItem('position')
      const map = new naver.maps.Map('map', {
        center: createLatLng(
          pos ? JSON.parse(pos).coords.latitude : 37.5665,
          pos ? JSON.parse(pos).coords.longitude : 126.978,
        ),
        zoom: DEFAULT_MAP_ZOOM,
        mapTypeId: naver.maps.MapTypeId.NORMAL,
      })
      setRouteMapInstance(map)
      isMapInitializedRef.current = true
    }
  }

  useEffect(() => {
    if (typeof naver === 'undefined') return
    handleMapLoad()
  }, [])

  useEffect(() => {
    if (!position) return
    if (typeof naver === 'undefined') return

    const map = getRouteMapInstance()
    if (!map) return

    map.panTo(createLatLng(position.coords.latitude, position.coords.longitude))
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
