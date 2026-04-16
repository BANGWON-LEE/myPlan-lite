import { PurposeCardType } from '@/types/cardTypes'

export default function PurposeCard({
  selectedIndex,
  id,
  icon: Icon,
  label,
  color,
  isActive,
  onClick,
}: PurposeCardType) {
  return (
    <div key={id} className="relative">
      {selectedIndex !== -1 ? (
        <div className="pointer-events-none absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-900 shadow-sm">
          {selectedIndex + 1}
        </div>
      ) : null}
      <button
        onClick={() => onClick(id)}
        className={`p-6 w-full rounded-2xl transition-all duration-300 ${
          isActive
            ? `${color} text-white shadow-lg scale-105 border-2 border-${color}`
            : 'bg-white text-gray-700 hover:shadow-md border-2 border-gray-100'
        }`}
      >
        <Icon className="w-8 h-8 mx-auto mb-2" />
        <p className="font-semibold text-sm">{label}</p>
      </button>
    </div>
  )
}
