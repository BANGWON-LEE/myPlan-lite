'use client'
import RouteBottom from './RouteBottom'
import RouteHeader from './RouteHeader'
import RouteMap from './RouteMap'
import RoutePlace from './RoutePlace'

export default function RouteMain() {
  return (
    <div className="font-sans">
      <div className="min-h-screen bg-gray-50">
        <RouteHeader />
        <RouteMap />
        <RoutePlace />
        <RouteBottom />
      </div>
    </div>
  )
}
