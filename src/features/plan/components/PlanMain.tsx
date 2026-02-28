'use client'
import React, { useState } from 'react'
import {
  Coffee,
  Utensils,
  ShoppingBag,
  BriefcaseMedicalIcon,
} from 'lucide-react'
import { SectionTitle } from '@/share/components/Text'
import { PurposeCard, TimeCard } from '@/share/components/Card'
import { PrimaryButtonText } from '@/share/components/Button'
import Link from 'next/link'

export default function PlanMain() {
  // 목적 선택 옵션 객체 리터럴로 정의
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
  ]

  // 선택된 목적과 시간 상태값
  const [selectedPurpose, setSelectedPurpose] = useState<string[]>([])

  // 시간 선택 옵션 배열
  const timeOptionsArr = [
    { time: 10, radius: 1 },
    { time: 20, radius: 5 },
    { time: 30, radius: 10 },
  ]

  // 선택된 시간 상태값
  const [selectedTime, setSelectedTime] = useState(1)

  // 목적 선택 토글 함수
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
        <SectionTitle className="mb-4">어떤 장소를 찾고 싶으세요?</SectionTitle>
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
          몇 분 거리까지의 장소를 원하시나요?
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
          ',',
        )}&time=${selectedTime}`}
      >
        <PrimaryButtonText
          disabled={selectedPurpose.length === 0}
          //   onClick={() => console.log('Start')}
        >
          장소 찾기
        </PrimaryButtonText>
      </Link>
    </React.Fragment>
  )
}
