import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { GeistMono, GeistSans } from 'geist/font'

export const metadata: Metadata = {
  title: '마이 플랜',
  description: '가장 가까운 장소와 루트를 추천해주는 서비스',
  manifest: '/manifest.json',
  icons: {
    icon: '/assets/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Analytics />
        {children}
      </body>
    </html>
  )
}
