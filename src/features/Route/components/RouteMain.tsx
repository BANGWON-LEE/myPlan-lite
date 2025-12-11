'use client'

import dynamic from 'next/dynamic'

const RoutePlace = dynamic(() => import('../components/RoutePlace'), {
  ssr: false, // ⭐ 가장 중요! (클라이언트에서만 렌더, 번들 분리됨)
})

export default function RouteMain() {
  return <RoutePlace />
}
