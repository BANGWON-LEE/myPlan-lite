import { MapPin } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
          <MapPin className="w-12 h-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        {/* PrimaryButtonText 스타일과 통일된 텍스트 */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white ">
            루트를 생성하고 있어요
          </h2>
          <p className="text-white/80">근처 장소를 분석하고 있습니다...</p>
        </div>
      </div>
    </div>
  )
}
