import { RouteCategoryKey } from '@/types/routeType'
import {
  BriefcaseMedicalIcon,
  Coffee,
  MapPinned,
  Music4,
  ShoppingBag,
  Utensils,
} from 'lucide-react'

export const initialPlaceObj = {
  name: '',
  path: {
    x: 0,
    y: 0,
  },
  address: '',
  roadAddress: '',
  category: '',
}

export const PURPOSE_TO_CATEGORY_KEY: Record<string, RouteCategoryKey> = {
  음식점: 'meal',
  커피: 'coffee',
  약국: 'pharmacy',
  편의점: 'shopping',
  노래방: 'karaoke',
  관광지: 'touristSpot',
}

export const ORDERED_MARKER_COLORS = [
  'bg-green-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-blue-500',
  'bg-blue-600',
  'bg-blue-700',
] as const

export const ORDERED_ROUTE_COLORS = [
  '#22c55e',
  '#1d4ed8',
  '#06b6d4',
  '#3b82f6',
  '#14b8a6',
  '#2563eb',
] as const

// 위치 저장 payload를 localStorage에 보관할 때 사용하는 키 (src/util/storage/positionStorage.ts)
export const POSITION_STORAGE_KEY = 'position'

// 마지막 위치 저장 요청 시각을 localStorage에 보관할 때 사용하는 키 (src/util/storage/positionStorage.ts)
export const REQUEST_TIME_KEY = 'requestTime'

// 위치 정보를 다시 저장하기 위한 최소 간격 5분 (src/util/storage/positionStorage.ts)
export const FIVE_MINUTES_MS = 5 * 60 * 1000

// 거리를 시간으로 환산할 때 사용하는 평균 도보 속도 (km/h)
export const AVERAGE_WALKING_SPEED_KM_PER_HOUR = 4.5

// 거리를 초 단위 시간으로 환산할 때 사용하는 평균 도보 속도 (m/s)
export const AVERAGE_WALKING_SPEED_METERS_PER_SECOND =
  (AVERAGE_WALKING_SPEED_KM_PER_HOUR * 1000) / 3600

// 거리를 분 단위 시간으로 환산할 때 사용하는 평균 도보 속도 (km/min)
export const AVERAGE_WALKING_SPEED_KM_PER_MINUTE =
  AVERAGE_WALKING_SPEED_KM_PER_HOUR / 60

export const purposes = [
  {
    id: '커피',
    key: 'coffee',
    icon: Coffee,
    label: '카페',
    color: 'bg-amber-500',
  },
  {
    id: '음식점',
    key: 'meal',
    icon: Utensils,
    label: '식사',
    color: 'bg-rose-500',
  },
  {
    id: '약국',
    key: 'pharmacy',
    icon: BriefcaseMedicalIcon,
    label: '약국',
    color: 'bg-emerald-500',
  },
  {
    id: '편의점',
    key: 'shopping',
    icon: ShoppingBag,
    label: '편의점',
    color: 'bg-blue-500',
  },
  {
    id: '노래방',
    key: 'karaoke',
    icon: Music4,
    label: '노래방',
    color: 'bg-fuchsia-500',
  },
  {
    id: '관광지',
    key: 'touristSpot',
    icon: MapPinned,
    label: '관광지',
    color: 'bg-orange-500',
  },
]
