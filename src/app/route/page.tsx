import RouteBottom from '@/features/Route/components/RouteBottom'
import RouteHeader from '@/features/Route/components/RouteHeader'
import RouteMain from '@/features/Route/components/RouteMain'
// import RouteMap from '@/features/Route/components/RouteMap'

export default function RoutePage() {
  // console.log('qqqqq ')
  return (
    <div className="font-sans">
      <div className="min-h-screen bg-gray-50">
        <RouteHeader />
        <RouteMain />
        <RouteBottom />
      </div>
    </div>
  )
}
