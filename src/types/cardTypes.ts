import { LucideIcon } from 'lucide-react'

export type PurposeCardType = {
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick: () => void
  color: string
}

export type TimeCardType = {
  time: number
  isActive: boolean
  onClick: () => void
}
