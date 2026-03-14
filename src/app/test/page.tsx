import type { Metadata } from 'next'
import Test from '@/test/Test'
import { Navigation } from 'lucide-react'

export const metadata: Metadata = {
  title: '테스트 | 마이 플랜',
  description: '카테고리와 시간 데이터 테스트를 위한 전용 페이지입니다.',
  alternates: {
    canonical: '/test',
  },
}

export default function TestPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-md mx-auto">
        <header className="text-center mb-12 mt-8">
          <div className="inline-block p-3 bg-indigo-600 rounded-2xl mb-4 animate-bounce">
            <Navigation className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">마이 플랜</h1>
          <p className="text-gray-600">목적에 맞는 최적 루트를 1초 만에</p>
        </header>
        <section aria-label="루트 추천">
          <Test />
        </section>
      </div>
    </main>
  )
}
