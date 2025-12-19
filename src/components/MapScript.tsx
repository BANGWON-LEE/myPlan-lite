'use client'

import { POSITION_QUERY_KEY } from '@/lib/queryKeys'
import { onLoadRouteMap } from '@/util/map/mapFunctions'
import { useQuery } from '@tanstack/react-query'
import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'

export default function MapScript() {
  const getPosition = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error)
      )
    })

  const { data: position } = useQuery<GeolocationPosition>({
    queryKey: POSITION_QUERY_KEY,
    queryFn: async () => await getPosition(),
    staleTime: 1000 * 60 * 5, // 5분
  })

  function savePositionStorage() {
    if (!position) return
    localStorage.setItem('poi-cache', JSON.stringify(position))
    return true
  }

  const storagePosition = localStorage.getItem('poi-cache')
  const formatPosition = storagePosition ? JSON.parse(storagePosition) : null
  useEffect(() => {
    if (!window.naver) return
    savePositionStorage()

    console.log('formatRR', formatPosition)

    const initialPosition = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(
        37.5665, // 서울
        126.978
      ),
      zoom: 14,
      mapTypeId: naver.maps.MapTypeId.NORMAL,
    })
    onLoadRouteMap(formatPosition, initialPosition)
  }, [])
  return (
    <>
      <Head>
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
      </Head>

      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        strategy="afterInteractive"
        onLoad={() => {
          savePositionStorage()
          onLoadRouteMap(
            formatPosition!,
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
