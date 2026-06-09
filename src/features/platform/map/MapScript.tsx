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
    // console.log('지도 로드 시도@@')
    const storagePos = localStorage.getItem('position')
    const pos = position ?? (storagePos ? JSON.parse(storagePos) : null)

    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(
        pos ? pos.coords.latitude : 37.5665,
        pos ? pos.coords.longitude : 126.978,
      ),
      zoom: DEFAULT_MAP_ZOOM,
      mapTypeId: naver.maps.MapTypeId.NORMAL,
    })
    setMap(map)
  }

  const map = useMapStore(state => state.map)

  useEffect(() => {
    if (typeof naver === 'undefined') return
    if (map) return
    handleMapLoad()
  }, [])

  useEffect(() => {
    return () => {
      setMap(null)
    }
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
