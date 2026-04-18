import { useState } from 'react'

export function useTimeCardBtn() {
  // 시간 선택 옵션 배열
  const timeOptionsArr = [
    { time: 10, radius: 1 },
    { time: 20, radius: 5 },
    { time: 30, radius: 10 },
  ]

  // 선택된 시간 상태값
  const [selectedTime, setSelectedTime] = useState(1)

  return {
    timeOptionsArr,
    selectedTime,
    onClick: (radius: number) => setSelectedTime(radius),
  }
}
