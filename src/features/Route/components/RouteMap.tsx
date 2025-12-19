'use client'
import MapScript from '@/components/MapScript'
import { POSITION_QUERY_KEY } from '@/lib/queryKeys'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export default function RouteMap() {
  // const mapRef = useRef(null)

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
  useEffect(() => {
    // if (!window.naver) return

    if (!position) return
    localStorage.setItem('poi-cache', JSON.stringify(position))
  }, [position])

  return (
    <>
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
        {position && <MapScript position={position} />}
        <div className="absolute inset-0 flex items-center justify-center">
          <div id="map" className="w-full h-full"></div>
        </div>

        {/* 루트 정보 카드 - StatValue & StatLabel 컴포넌트 사용 */}
      </div>
    </>
  )
}
