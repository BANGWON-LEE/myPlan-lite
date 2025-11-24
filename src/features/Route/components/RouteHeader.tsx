import { SectionTitle } from '@/share/components/Text'

export default function RouteHeader() {
  return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <button
          // onClick={() => setScreen('home')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {/* SectionTitle 컴포넌트 사용 */}
        <SectionTitle>추천 루트</SectionTitle>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
