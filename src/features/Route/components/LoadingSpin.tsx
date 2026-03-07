'use client'
import FindingPlaceSpinner from '@/share/components/FindingPlaceSpinner'
import React from 'react'

export default function LoadingSpin(props: { isDisabled: boolean }) {
  const { isDisabled } = props

  return (
    <React.Fragment>
      {isDisabled && (
        <div className="absolute top-0 w-full ">
          <div className=" grid  h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
            <FindingPlaceSpinner />
          </div>
          {/* 루트 정보 카드 - StatValue & StatLabel 컴포넌트 사용 */}
        </div>
      )}
    </React.Fragment>
  )
}
