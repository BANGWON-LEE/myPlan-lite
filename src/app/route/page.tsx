import RouteBottom from '@/features/Route/components/RouteBottom'
import RouteHeader from '@/features/Route/components/RouteHeader'
import RouteMain from '@/features/Route/components/RouteMain'
// import RouteMap from '@/features/Route/components/RouteMap'
import dynamic from 'next/dynamic'

const RouteMap = dynamic(
  () => import('../../features/Route/components/RouteMap'),
  {
    ssr: false,
  }
)

export default function RoutePage() {
  return (
    <div className="font-sans">
      <div className="min-h-screen bg-gray-50">
        <RouteHeader />
        <RouteMap />
        <RouteMain />
        <RouteBottom />
      </div>
    </div>
  )
}
