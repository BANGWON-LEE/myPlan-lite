import { purposes } from '@/data/constant'

import { useState } from 'react'

export function usePurposeCardbtn() {
  const [selectedPurpose, setSelectedPurpose] = useState<string[]>([])

  function togglePurpose(id: string) {
    setSelectedPurpose((prev: string[]) => {
      return prev.includes(id)
        ? prev.filter(category => category !== id)
        : [...prev, id]
    })
  }

  return {
    purposes: purposes.map(({ id, icon, label, color }) => {
      const selectedIndex = selectedPurpose.indexOf(id)

      return {
        selectedIndex,
        id,
        icon,
        label,
        color,
        isActive: selectedPurpose.includes(id),
        onClick: (id: string) => togglePurpose(id),
      }
    }),
    selectedPurpose,
  }
}
