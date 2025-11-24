import { StatLabel, StatValue } from '@/share/components/Text'
import { MapPin } from 'lucide-react'

export default function RouteMap() {
  return (
    <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-indigo-600 mx-auto mb-2 animate-pulse" />
          <p className="text-sm text-gray-600">지도 API 연동 예정</p>
        </div>
      </div>

      {/* 루트 정보 카드 - StatValue & StatLabel 컴포넌트 사용 */}
      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <StatLabel>총 소요시간</StatLabel>
            <StatValue>약 10분</StatValue>
          </div>
          <div className="text-right">
            <StatLabel>총 거리</StatLabel>
            <StatValue color="text-gray-900">1.3km</StatValue>
          </div>
        </div>
      </div>
    </div>
  )
}
