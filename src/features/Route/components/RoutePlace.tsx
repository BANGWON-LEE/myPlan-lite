import { StatLabel, StatValue } from '@/share/components/Text'
import { Clock, MapPin, Star } from 'lucide-react'

export default function RoutePlace() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
      <div className=" bg-white rounded-2xl p-4 shadow-lg">
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
      {[
        {
          id: 1,
          name: '그린카페',
          type: '카페',
          rating: 4.5,
          distance: '250m',
          time: '3분',
        },
        {
          id: 2,
          name: '한강뷰 공원',
          type: '산책',
          rating: 4.8,
          distance: '600m',
          time: '8분',
        },
        {
          id: 3,
          name: '북카페 라운지',
          type: '휴식',
          rating: 4.6,
          distance: '450m',
          time: '6분',
        },
      ].map((place, index) => (
        <div
          key={place.id}
          className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <div className="flex">
            <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-purple-100"></div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-indigo-600">
                      #{index + 1}
                    </span>
                    <h3 className="font-bold text-gray-900">{place.name}</h3>
                  </div>
                  {/* StatLabel 컴포넌트 사용 */}
                  <StatLabel>{place.type}</StatLabel>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{place.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{place.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{place.time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
