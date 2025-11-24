'use client'
import React, { useState } from 'react'
import { Coffee, Utensils, TreePine, Home, Navigation } from 'lucide-react'
import { SectionTitle } from '@/share/components/Text'
import { PurposeCard, TimeCard } from '@/share/components/Card'
import { PrimaryButtonText } from '@/share/components/Button'

export default function PlanMain() {
  const purposes = [
    { id: 'cafe', icon: Coffee, label: '카페', color: 'bg-amber-500' },
    { id: 'meal', icon: Utensils, label: '식사', color: 'bg-rose-500' },
    { id: 'walk', icon: TreePine, label: '산책', color: 'bg-emerald-500' },
    { id: 'rest', icon: Home, label: '휴식', color: 'bg-blue-500' },
  ]

  const [selectedPurpose, setSelectedPurpose] = useState(null)
  const [selectedTime, setSelectedTime] = useState(60)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12 mt-8">
          <div className="inline-block p-3 bg-indigo-600 rounded-2xl mb-4 animate-bounce">
            <Navigation className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">myPlan Lite</h1>
          <p className="text-gray-600">목적에 맞는 최적 루트를 1초 만에</p>
        </div>

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
                isActive={selectedPurpose === id}
                onClick={() => console.log('purpose')}
                // onClick={() => setSelectedPurpose(id)}
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
            {[30, 60, 120].map(time => (
              <TimeCard
                key={time}
                time={time}
                isActive={selectedTime === time}
                onClick={() => setSelectedTime(time)}
              />
            ))}
          </div>
        </div>

        {/* 시작 버튼 - PrimaryButtonText 컴포넌트 사용 */}
        <PrimaryButtonText
          disabled={!selectedPurpose}
          onClick={() => console.log('Start')}
        >
          루트 추천받기
        </PrimaryButtonText>
      </div>
    </div>
  )
}
