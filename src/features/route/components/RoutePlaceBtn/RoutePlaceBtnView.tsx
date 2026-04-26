export function RoutePlaceBtn(props: {
  children: React.ReactNode
  searchErrorMessage: string
  isDisabled: boolean
  onClick: () => void
}) {
  const { children, searchErrorMessage, isDisabled, onClick } = props

  return (
    <button
      className="h-full w-full bg-amber-200"
      disabled={isDisabled}
      onClick={() => {
        onClick()
      }}
    >
      <span
        className={`px-1 py-2 font-semibold w-full text-sm ${searchErrorMessage ? 'text-red-500' : 'text-amber-600'}`}
      >
        {children}
      </span>
    </button>
  )
}
