import {
  SectionTitleType,
  StatLabelType,
  StatValueType,
} from '@/types/textType'

// 재사용 가능한 헤더/제목 텍스트 컴포넌트
export const SectionTitle = ({
  children,
  className = '',
}: SectionTitleType) => {
  return (
    <h2 className={`text-lg font-semibold text-gray-800 ${className}`}>
      {children}
    </h2>
  )
}

// 재사용 가능한 값 표시 텍스트 컴포넌트 (60분, 1.3km 등)
export const StatValue = ({
  children,
  color = 'text-indigo-600',
}: StatValueType) => {
  return <p className={`text-xl font-bold ${color}`}>{children}</p>
}

// 재사용 가능한 라벨 텍스트 컴포넌트 (총 소요시간, 카페 등)
export const StatLabel = ({ children }: StatLabelType) => {
  return <p className="text-sm text-gray-600">{children}</p>
}
