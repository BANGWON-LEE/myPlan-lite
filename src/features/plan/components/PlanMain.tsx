'use client'
import React, { useState } from 'react'
import {
  Coffee,
  Utensils,
  ShoppingBag,
  BriefcaseMedicalIcon,
  Music4,
  MapPinned,
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
      <div className="mb-8">
        <SectionTitle className="mb-4">어떤 장소를 찾고 싶으세요?</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          {purposes.map(({ id, icon, label, color }) => {
            const selectedIndex = selectedPurpose.indexOf(id)

            return (
              <div key={id} className="relative">
                {selectedIndex !== -1 ? (
                  <div className="pointer-events-none absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-900 shadow-sm">
                    {selectedIndex + 1}
                  </div>
                ) : null}
                <PurposeCard
                  icon={icon}
                  label={label}
                  color={color}
                  isActive={selectedIndex !== -1}
                  onClick={() => togglePurpose(id)}
                />
              </div>
            )
          })}
        </div>
      </div>

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

      <Link
        href={`/route?purposes=${selectedPurpose.join(
          ',',
        )}&time=${selectedTime}`}
      >
        <PrimaryButtonText disabled={selectedPurpose.length === 0}>
          장소 찾기
        </PrimaryButtonText>
      </Link>
    </React.Fragment>
  )
}
