'use client'
import MapScript from '@/features/platform/map/MapScript'
import {
  useMapReadyStore,
  useMapStore,
  usePositionStore,
  useStartPointStore,
} from '@/stores/useRouteStore'
import { RouteMapProps } from '@/types/routeType'
import { savePositionToStorage } from '@/util/storage/positionStorage'
import { useEffect, useRef, useState } from 'react'
import LoadingSpin from './LoadingSpin'
import { getCurrentPositionPromise } from '@/util/map/mapFunctions'
import {
  drawRouteByPoints,
  getDrawMyMarker,
} from '../containers/drawRouteContainer'

export default function RouteMap({
  position,
  selectedRoutePoints,
}: RouteMapProps) {
  const setPosition = usePositionStore(state => state.setPosition)
  useEffect(() => {
    if (!position) return
    setPosition(position)
    savePositionToStorage(position)
  }, [position, setPosition])

  const setStartPoint = useStartPointStore(state => state.setStartPoint)
  const map = useMapStore(state => state.map)
  const setMap = useMapStore(state => state.setMap)
  const isMapLoadReady = useMapReadyStore(state => state.isMapReady)

  const isMapReady = usePositionStore(state => state.position) !== null
  const startPoint = useStartPointStore(state => state.startPoint)

  const [errorMesage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const watchIdRef = useRef<number | null>(null)
  const placeMarkersRef = useRef<naver.maps.Marker>(null)

  useEffect(() => {
    if (!isMapReady) return
    if (!map) return
    if (!startPoint) return

    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => {
        const movingPoint = {
          x: pos.coords.longitude,
          y: pos.coords.latitude,
          name: '현재 위치',
        }

        placeMarkersRef.current?.setPosition(
          new naver.maps.LatLng(movingPoint.y, movingPoint.x),
        )
      },
      err => {
        setErrorMessage(
          '현재 위치를 가져오는 데 실패했습니다. 위치 권한을 확인해주세요.' +
            err.message,
        )
      },
      { enableHighAccuracy: true, maximumAge: 4000, timeout: 800 },
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [
    isMapReady,
    map,
    position,
    selectedRoutePoints,
    startPoint,
    placeMarkersRef,
  ])

  function toggleDisabled(state: boolean) {
    setIsLoading(state)
  }

  const placePolyPathRef = useRef<naver.maps.Polyline[] | undefined | null>([])
  const placePolyMarkersRef = useRef<naver.maps.Marker[] | undefined | null>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isMapLoadReady) return
    if (!map) return
    if (selectedRoutePoints.length === 0) return

    let cancelled = false

    const drawRoute = async () => {
      toggleDisabled(true)
      try {
        const currentPosition = await getCurrentPositionPromise()
        const startPoint = {
          x: currentPosition.coords.longitude,
          y: currentPosition.coords.latitude,
          name: '현재 위치',
        }

        if (!cancelled && map) {
          const currentPosiMarker = getDrawMyMarker(
            map,
            startPoint,
            startPoint.name,
          )

          placeMarkersRef.current = currentPosiMarker

          setStartPoint(startPoint)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    drawRoute()
    return () => {
      cancelled = true
    }
  }, [isMapLoadReady, setMap, setStartPoint])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isMapLoadReady) return
    if (!map) return
    if (selectedRoutePoints.length === 0) return
    if (
      placePolyPathRef.current === null ||
      placePolyMarkersRef.current === null
    )
      return

    placePolyPathRef.current?.forEach(polyline => {
      polyline.setMap(null)
    })
    placePolyPathRef.current = []

    placePolyMarkersRef.current?.forEach(marker => {
      marker.setMap(null)
    })
    placePolyMarkersRef.current = []

    // placeMarkersRef.current?.setMap(null)
    // placeMarkersRef.current = null

    const drawRoute = async () => {
      toggleDisabled(true)
      try {
        const currentPosition = await getCurrentPositionPromise()
        const startPoint = {
          x: currentPosition.coords.longitude,
          y: currentPosition.coords.latitude,
          name: '현재 위치',
        }

        if (map) {
          map.setCenter(new naver.maps.LatLng(startPoint.y, startPoint.x))
          placeMarkersRef.current?.setPosition(
            new naver.maps.LatLng(startPoint.y, startPoint.x),
          )

          const polyline = await drawRouteByPoints(
            map,
            selectedRoutePoints,
            startPoint,
          )

          placePolyPathRef.current = polyline.polylines
          placePolyMarkersRef.current = polyline.markers
        }
      } finally {
        setIsLoading(false)
      }
    }

    drawRoute()
  }, [position, selectedRoutePoints, isMapLoadReady])

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
      <LoadingSpin isLoading={isLoading} />
    </>
  )
}
