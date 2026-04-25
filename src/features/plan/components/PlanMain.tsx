'use client'
import React from 'react'

import { SectionTitle } from '@/share/components/Text'
import { PrimaryButtonText } from '@/share/components/Button'
import Link from 'next/link'
import { usePurposeCardbtn } from '../../ui/PurposeCard/PurposeCard.logic'
import PurposeCard from '../../ui/PurposeCard/PurposeCard'
import { useTimeCardBtn } from '../../ui/TimeCard/TimeCard.logic'
import { TimeCard } from '../../ui/TimeCard/TimeCard'

export default function PlanMain() {
  const purposeCardBtn = usePurposeCardbtn()
  const { selectedPurpose } = purposeCardBtn
  const { purposes } = purposeCardBtn

  const { timeOptionsArr, selectedTime, onClick } = useTimeCardBtn()

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
              onClick={() => onClick(li.radius)}
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
