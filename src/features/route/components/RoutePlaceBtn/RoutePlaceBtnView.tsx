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
      <div
        className={`px-3 py-2 font-semibold ${searchErrorMessage ? 'text-red-500' : 'text-amber-600'}`}
      >
        {children}
      </div>
    </button>
  )
}
