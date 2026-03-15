import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { GeistMono, GeistSans } from 'geist/font'
import IndexRedirectGuard from '@/components/IndexRedirectGuard'

export const metadata: Metadata = {
  title: '마이 플랜',
  description: '가장 가까운 장소와 루트를 추천해주는 서비스',
  manifest: '/manifest.json',
  icons: {
    icon: '/assets/logo.png',
    apple: '/icons/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '마이 플랜',
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
        <IndexRedirectGuard />
        <Analytics />
        {children}
      </body>
    </html>
  )
}
