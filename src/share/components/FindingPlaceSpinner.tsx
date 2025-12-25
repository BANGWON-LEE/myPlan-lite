'use client'

export default function FindingPlaceSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* 스피너 */}
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200" />
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
      </div>

      {/* 텍스트 */}
      <p className="text-sm font-medium text-indigo-700 animate-pulse">
        장소를 찾고 있어요…
      </p>
    </div>
  )
}
