'use client'
import { useRoutePlaceIdxStore } from '@/stores/useRouteStore'

export default function RouteBottom() {
  const { incIdx } = useRoutePlaceIdxStore()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="max-w-md mx-auto flex gap-3">
        {/* <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
          공유하기
        </button> */}
        <button
          className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          onClick={incIdx}
        >
          {/* 다른 루트 보기 */}
          다른 장소 보기
        </button>
      </div>
    </div>
  )
}
