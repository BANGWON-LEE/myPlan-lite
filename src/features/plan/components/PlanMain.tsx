'use client'
import React, { useState } from 'react'
import {
  Coffee,
  Utensils,
  TreePine,
  Navigation,
  ShoppingBag,
} from 'lucide-react'
import { SectionTitle } from '@/share/components/Text'
import { PurposeCard, TimeCard } from '@/share/components/Card'
import { PrimaryButtonText } from '@/share/components/Button'
import Link from 'next/link'

export default function PlanMain() {
  const purposes = [
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
      id: '공원',
      key: 'walk',
      icon: TreePine,
      label: '산책',
      color: 'bg-emerald-500',
    },
    {
      id: '쇼핑',
      key: 'shopping',
      icon: ShoppingBag,
      label: '쇼핑',
      color: 'bg-blue-500',
    },
  ]

  const [selectedPurpose, setSelectedPurpose] = useState<string[]>([])

  const timeOptionsArr = [
    { time: 10, radius: 1 },
    { time: 20, radius: 5 },
    { time: 30, radius: 10 },
  ]

  const [selectedTime, setSelectedTime] = useState(10)

  function togglePurpose(id: string) {
    setSelectedPurpose((prev: string[]) => {
      return prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    })
  }

  return (
    <React.Fragment>
      {/* 헤더 */}

      {/* 목적 선택 - PurposeCard 컴포넌트 사용 */}
      <div className="mb-8">
        <SectionTitle className="mb-4">
          어떤 시간을 보내고 싶으세요?
        </SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          {purposes.map(({ id, icon, label, color }) => (
            <PurposeCard
              key={id}
              icon={icon}
              label={label}
              color={color}
              isActive={selectedPurpose.includes(id)}
              onClick={() => togglePurpose(id)}
            />
          ))}
        </div>
      </div>

      {/* 시간 선택 - TimeCard 컴포넌트 사용 */}
      <div className="mb-8">
        <SectionTitle className="mb-4">
          얼마나 시간을 보내실 건가요?
        </SectionTitle>
        <div className="flex gap-3">
          {timeOptionsArr.map(li => (
            <TimeCard
              key={li.time}
              time={li.time}
              isActive={selectedTime === li.radius}
              onClick={() => setSelectedTime(li.radius)}
            />
          ))}
        </div>
      </div>

      {/* 시작 버튼 - PrimaryButtonText 컴포넌트 사용 */}
      <Link
        href={`/route?purposes=${selectedPurpose.join(
          ','
        )}&time=${selectedTime}`}
      >
        <PrimaryButtonText
          disabled={selectedPurpose.length === 0}
          //   onClick={() => console.log('Start')}
        >
          루트 추천받기
        </PrimaryButtonText>
      </Link>
    </React.Fragment>
  )
}
