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

const MIN_MAP_PAN_DISTANCE_METERS = 20

function getDistanceMeters(
  prev: { latitude: number; longitude: number },
  next: { latitude: number; longitude: number },
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const earthRadiusMeters = 6371000
  const dLat = toRad(next.latitude - prev.latitude)
  const dLon = toRad(next.longitude - prev.longitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(prev.latitude)) *
      Math.cos(toRad(next.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusMeters * c
}

export default function MapScript() {
  const position = usePositionStore(state => state.position)
  const isMapInitializedRef = useRef(false)
  const lastPannedCoordsRef = useRef<{
    latitude: number
    longitude: number
  } | null>(null)

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

    const nextCoords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }
    const prevCoords = lastPannedCoordsRef.current
    if (prevCoords) {
      const distanceMeters = getDistanceMeters(prevCoords, nextCoords)
      if (distanceMeters < MIN_MAP_PAN_DISTANCE_METERS) {
        return
      }
    }

    map.panTo(createLatLng(position.coords.latitude, position.coords.longitude))
    lastPannedCoordsRef.current = nextCoords
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
