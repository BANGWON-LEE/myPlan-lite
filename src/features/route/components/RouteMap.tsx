'use client'
import MapScript from '@/components/MapScript'
import { usePositionStore } from '@/stores/useRouteStore'
import { MapScriptProps } from '@/types/placeType'
import { savePositionToStorage } from '@/util/storage/positionStorage'
import { useEffect, useRef, useState } from 'react'

export default function RouteMap(props: MapScriptProps) {
  const { position, mapRef } = props

  const setPosition = usePositionStore(state => state.setPosition)
  useEffect(() => {
    if (!position) return
    setPosition(position)
    savePositionToStorage(position)
  }, [position, setPosition])

  const [errorMesage, setErrorMessage] = useState<string | null>(null)

  const isMapReady = usePositionStore(state => state.position) !== null

  // useEffect(() => {
  //   let watchId: number | null = null
  //   try {
  //     watchId = navigator.geolocation.watchPosition(
  //       pos => {
  //         const startPoint = {
  //           x: pos.coords.longitude,
  //           y: pos.coords.latitude,
  //           name: '현재 위치',
  //         }
  //       },
  //       error => {
  //         console.error('Error getting current position:', error)
  //         setErrorMessage(
  //           '현재 위치를 가져오는 데 실패했습니다. 위치 권한을 확인해주세요.',
  //         )
  //       },
  //     )
  //   } catch (error) {
  //     console.error(error)
  //   }

  //   return () => {
  //     if (watchId !== null) {
  //       navigator.geolocation.clearWatch(watchId)
  //     }
  //   }
  // }, [mapRef])

  const myMarkerRef = useRef<naver.maps.Marker | null>(null)
  const watchIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isMapReady) return
    if (!mapRef.current) return

    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => {
        if (!mapRef.current) return

        const latLng = new naver.maps.LatLng(
          pos.coords.latitude,
          pos.coords.longitude,
        )

        // 최초 1회만 생성
        if (!myMarkerRef.current) {
          myMarkerRef.current = new naver.maps.Marker({
            position: latLng,
            map: mapRef.current,
            title: '현재 위치',
          })
        } else {
          // 이후에는 위치만 갱신
          myMarkerRef.current.setPosition(latLng)
        }

        // 필요하면 지도 중심 이동
        // mapRef.current.panTo(latLng)
      },
      err => {
        console.error(err)
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 800 },
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [isMapReady, mapRef])

  return (
    <>
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
        <MapScript />
        <div className="absolute inset-0 flex items-center justify-center">
          <div id="map" className="w-full h-full"></div>
        </div>
        <div>
          <p>{errorMesage}</p>
        </div>
      </div>
    </>
  )
}
