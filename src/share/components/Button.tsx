import { PrimaryButtonTextType } from '@/types/buttonType'

// 재사용 가능한 큰 버튼 텍스트 컴포넌트

export const PrimaryButtonText = ({
  children,
  disabled,
  onClick,
}: PrimaryButtonTextType) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
        disabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
      }`}
    >
      {children}
    </button>
  )
}
