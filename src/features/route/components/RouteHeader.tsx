import { SectionTitle } from '@/share/components/Text'
import Link from 'next/link'

export default function RouteHeader() {
  return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      <div className="flex items-center justify-start max-w-md mx-auto">
        <Link href="/">
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
        </Link>
        {/* SectionTitle 컴포넌트 사용 */}
        <SectionTitle>추천 루트</SectionTitle>
      </div>
    </div>
  )
}
