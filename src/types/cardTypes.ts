import { LucideIcon } from 'lucide-react'

export type PurposeCardType = {
  selectedIndex: number
  id: string
  icon: LucideIcon
  label: string
  color: string
  isActive: boolean
  onClick: (id: string) => void
}

export type TimeCardType = {
  time: number
  isActive: boolean
  onClick: () => void
}
