import type { Metadata } from 'next'
import PlanMain from '@/features/plan/components/PlanMain'
import { Navigation } from 'lucide-react'

export const metadata: Metadata = {
  title: '마이 플랜 | 목적에 맞는 최적 루트',
  description: '목적에 맞는 최적 루트를 빠르게 추천받아 이동 시간을 줄이세요.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '마이 플랜 | 목적에 맞는 최적 루트',
    description:
      '목적에 맞는 최적 루트를 빠르게 추천받아 이동 시간을 줄이세요.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '마이 플랜 | 목적에 맞는 최적 루트',
    description:
      '목적에 맞는 최적 루트를 빠르게 추천받아 이동 시간을 줄이세요.',
  },
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '마이 플랜',
    description:
      '목적에 맞는 최적 장소를 빠르게 추천받아 이동 시간을 줄이세요.',
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Web',
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-md mx-auto">
        <header className="text-center mb-12 mt-8">
          <div className="inline-block p-3 bg-indigo-600 rounded-2xl mb-4 animate-bounce">
            <Navigation className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">마이 플랜</h1>
          <p className="text-gray-600">목적에 맞는 최적 루트를 1초 만에</p>
        </header>
        <section aria-label="루트 추천">
          <PlanMain />
        </section>
      </div>
    </main>
  )
}
