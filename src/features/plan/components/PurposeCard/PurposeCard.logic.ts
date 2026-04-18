import {
  BriefcaseMedicalIcon,
  Coffee,
  MapPinned,
  Music4,
  ShoppingBag,
  Utensils,
} from 'lucide-react'
import { useState } from 'react'

export function usePurposeCardbtn() {
  const [selectedPurpose, setSelectedPurpose] = useState<string[]>([])

  const purposes = [
    {
      id: '커피',
      key: 'coffee',
      icon: Coffee,
      label: '카페',
      color: 'bg-amber-500',
    },
    {
      id: '음식점',
      key: 'meal',
      icon: Utensils,
      label: '식사',
      color: 'bg-rose-500',
    },
    {
      id: '약국',
      key: 'pharmacy',
      icon: BriefcaseMedicalIcon,
      label: '약국',
      color: 'bg-emerald-500',
    },
    {
      id: '편의점',
      key: 'shopping',
      icon: ShoppingBag,
      label: '편의점',
      color: 'bg-blue-500',
    },
    {
      id: '노래방',
      key: 'karaoke',
      icon: Music4,
      label: '노래방',
      color: 'bg-fuchsia-500',
    },
    {
      id: '관광지',
      key: 'touristSpot',
      icon: MapPinned,
      label: '관광지',
      color: 'bg-orange-500',
    },
  ]

  return {
    purposes: purposes.map(({ id, icon, label, color }) => {
      const selectedIndex = selectedPurpose.indexOf(id)

      return {
        selectedIndex,
        id,
        icon,
        label,
        color,
        isActive: selectedIndex !== -1,
        onClick: (id: string) => {
          setSelectedPurpose((prev: string[]) => {
            return prev.includes(id)
              ? prev.filter(pid => pid !== id)
              : [...prev, id]
          })
        },
      }
    }),
    selectedPurpose,
  }
}
