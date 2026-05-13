export function RoutePlaceBtn(props: {
  children: React.ReactNode
  isDisabled: boolean
  onClick: () => void
}) {
  const { children, isDisabled, onClick } = props

  return (
    <button
      className="h-full w-full"
      disabled={isDisabled}
      onClick={() => {
        onClick()
      }}
    >
      {children}
    </button>
  )
}
