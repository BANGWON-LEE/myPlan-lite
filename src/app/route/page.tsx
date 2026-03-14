import RouteHeader from '@/features/route/components/RouteHeader'
import RouteMain from '@/features/route/components/RouteMain'

export default function RoutePage() {
  // console.log('qqqqq ')
  return (
    <div className="font-sans">
      <div className="min-h-screen bg-gray-50">
        <RouteHeader />
        {/* <RouteMap /> */}
        <RouteMain />
        {/* <RouteBottom /> */}
      </div>
    </div>
  )
}
