import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import PurposeCard from './PurposeCard'
import { purposes } from '@/data/constant'
import { useState } from 'react'

const meta: Meta<typeof PurposeCard> = {
  title: 'Components/Card/PurposeCard',
  component: PurposeCard,
  tags: ['autodocs'],

  args: {
    id: purposes[0].id,
    label: purposes[0].label,
    icon: purposes[0].icon,
    color: purposes[0].color,
    isActive: false,
    selectedIndex: 0,
  },
  argTypes: {
    label: { control: 'text' },
    onClick: { action: 'clicked' },
  },
}

export default meta

type Story = StoryObj<typeof PurposeCard>

export const Default: Story = {}

export const Interactive: Story = {
  render: args => {
    const [selected, setSelected] = useState<string[]>([])

    const isActive = selected.includes(args.id)
    const selectedIndex = selected.indexOf(args.id)

    return (
      <PurposeCard
        {...args}
        isActive={isActive}
        selectedIndex={selectedIndex === -1 ? -1 : selectedIndex}
        onClick={id => {
          setSelected((prev: string[]) =>
            prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id],
          )
        }}
      />
    )
  },
}
