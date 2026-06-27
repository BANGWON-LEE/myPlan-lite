'use client'
import MapScript from '@/features/platform/map/MapScript'
import { useMapReadyStore, useMapStore } from '@/stores/useRouteStore'
import { RouteMapProps, RoutePoint, WalkArgType } from '@/types/routeType'
import { savePositionToStorage } from '@/util/storage/positionStorage'
import { useEffect, useRef, useState } from 'react'
import LoadingSpin from './LoadingSpin'
import {
  drawPolyline,
  getDrawMyMarker,
  getDrawRouteMarker,
  getOrderedRouteColor,
} from '../containers/drawRouteContainer'
import { useWalkQuery } from '../api/api'

export default function RouteMap({
  routeList,
  position, // 상위 컴포넌트에서 가져오는 현재 위치 좌표
  selectedRoutePoints,
}: RouteMapProps) {
  useEffect(() => {
    if (!position) return
    savePositionToStorage(position)
  }, [position])

  const map = useMapStore(state => state.map)
  const isMapLoadReady = useMapReadyStore(state => state.isMapReady)

  const isMapReady = isMapLoadReady && position

  const [errorMesage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const watchIdRef = useRef<number | null>(null)
  const placeMarkersRef = useRef<naver.maps.Marker>(null)

  useEffect(() => {
    if (!isMapReady) return
    if (!map) return

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
  }, [isMapReady, map, position, placeMarkersRef])

  function toggleDisabled(state: boolean) {
    setIsLoading(state)
  }

  const placePolyPathRef = useRef<naver.maps.Polyline[] | undefined | null>([])
  const placePolyMarkersRef = useRef<naver.maps.Marker[] | undefined | null>([])

  const getStartPosition = {
    x: position.coords.longitude,
    y: position.coords.latitude,
    name: '현재 위치',
  }

  const prevStartPositionRef = useRef<RoutePoint | null>(null)

  const isStartPositionChanged =
    prevStartPositionRef.current === null
      ? false
      : prevStartPositionRef.current.x !== getStartPosition.x ||
        prevStartPositionRef.current.y !== getStartPosition.y

  const { data: walkingPath } = useWalkQuery({
    selectedRoutePoints,
    getStartPosition,
    routeList,
    isStartPositionChanged,
  })

  async function drawRouteByPoints({
    map,
    selectedRoutePoints,
    getStartPosition,
  }: WalkArgType) {
    if (walkingPath === undefined) return

    let currentPoint = getStartPosition

    const polylineArr = [] as naver.maps.Polyline[]
    const lineMarkersArr = [] as naver.maps.Marker[]

    for (const [index, goalPoint] of selectedRoutePoints.entries()) {
      const polyline = drawPolyline(
        map,
        walkingPath.path[index],
        getOrderedRouteColor(index),
      )
      polylineArr.push(polyline)

      const marker = getDrawRouteMarker(
        map,
        goalPoint,
        `${index + 1}. ${goalPoint.name}`,
        index + 1,
      )
      lineMarkersArr.push(marker)
      currentPoint = goalPoint
    }

    return { polylines: polylineArr, markers: lineMarkersArr }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isMapLoadReady) return
    if (!map) return
    if (selectedRoutePoints.length === 0) return
    let cancelled = false
    let currentPosiMarker: naver.maps.Marker | null = null
    const drawRoute = async () => {
      toggleDisabled(true)
      try {
        placePolyPathRef.current?.forEach(polyline => {
          polyline.setMap(null)
        })
        placePolyPathRef.current = []

        placePolyMarkersRef.current?.forEach(marker => {
          marker.setMap(null)
        })
        placePolyMarkersRef.current = []

        placeMarkersRef.current?.setMap(null)
        placeMarkersRef.current = null

        if (map) {
          map.setCenter(
            new naver.maps.LatLng(getStartPosition.y, getStartPosition.x),
          )

          currentPosiMarker = getDrawMyMarker(
            map,
            getStartPosition,
            getStartPosition.name,
          )

          placeMarkersRef.current = currentPosiMarker

          const polyline = await drawRouteByPoints({
            map,
            selectedRoutePoints,
            getStartPosition,
          })

          prevStartPositionRef.current = getStartPosition

          placePolyPathRef.current = polyline?.polylines
          placePolyMarkersRef.current = polyline?.markers
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    drawRoute()
    return () => {
      cancelled = true

      currentPosiMarker?.setMap(null)

      if (placeMarkersRef.current === currentPosiMarker) {
        placeMarkersRef.current = null
      }
    }
  }, [map, position, selectedRoutePoints, isMapLoadReady, getStartPosition])

  return (
    <>
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
        <MapScript position={position} />
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
