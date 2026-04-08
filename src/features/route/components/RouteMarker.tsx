import { renderToStaticMarkup } from 'react-dom/server'
import { RouteMarkerProps } from '@/types/marker'

export function RouteMarker({ variant, index, color }: RouteMarkerProps) {
  if (variant === 'current') {
    const currentWrapperStyle =
      'relative flex items-center justify-center w-6 h-6'

    const currrentDotStyle = `absolute w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-md`

    const currentHaloStyle =
      'absolute w-6 h-6 rounded-full bg-blue-200 opacity-50 animate-ping'

    return (
      <div className={currentWrapperStyle}>
        <span className={currentHaloStyle} />
        <span className={currrentDotStyle} />
      </div>
    )
  }

  const orderedMarkerStyle = `flex items-center justify-center w-8 h-8 rounded-full ${color}  text-white text-sm font-bold border-2 border-white shadow-md`

  return <div className={orderedMarkerStyle}>{index ?? ''}</div>
}

export function renderRouteMarker(props: RouteMarkerProps) {
  return renderToStaticMarkup(<RouteMarker {...props} />)
}
