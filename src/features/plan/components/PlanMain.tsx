'use client'
import React, { useState } from 'react'

import { SectionTitle } from '@/share/components/Text'
import { TimeCard } from '@/share/components/Card'
import { PrimaryButtonText } from '@/share/components/Button'
import Link from 'next/link'
import { usePurposeCardbtn } from './PurposeCard/PurposeCard.logic'
import PurposeCard from './PurposeCard/PurposeCardView'

export default function PlanMain() {
  // 시간 선택 옵션 배열
  const timeOptionsArr = [
    { time: 10, radius: 1 },
    { time: 20, radius: 5 },
    { time: 30, radius: 10 },
  ]

  // 선택된 시간 상태값
  const [selectedTime, setSelectedTime] = useState(1)

  const purposeCardBtn = usePurposeCardbtn()
  const { selectedPurpose } = purposeCardBtn
  const { purposes } = purposeCardBtn

  return (
    <React.Fragment>
      <div className="mb-8">
        <SectionTitle className="mb-4">어떤 장소를 찾고 싶으세요?</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          {purposes.map(purpose => (
            <PurposeCard key={purpose.id} {...purpose} />
          ))}
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
