import { PurposeCardType, TimeCardType } from '@/types/cardTypes'
import { Clock } from 'lucide-react'

// 재사용 가능한 Card 컴포넌트 (목적 선택용)
export const PurposeCard = ({
  icon: Icon,
  label,
  isActive,
  onClick,
  color,
}: PurposeCardType) => {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl transition-all duration-300 ${
        isActive
          ? `${color} text-white shadow-lg scale-105`
          : 'bg-white text-gray-700 hover:shadow-md border-2 border-gray-100'
      }`}
    >
      <Icon className="w-8 h-8 mx-auto mb-2" />
      <p className="font-semibold text-sm">{label}</p>
    </button>
  )
}

// 재사용 가능한 Card 컴포넌트 (시간 선택용)
export const TimeCard = ({ time, isActive, onClick }: TimeCardType) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:shadow-sm border-2 border-gray-100'
      }`}
    >
      <Clock className="w-5 h-5 mx-auto mb-1" />
      <p className="text-sm font-semibold">{time}분</p>
    </button>
  )
}
