import { CSSProperties } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MarkerVariant } from '@/types/marker'

type RouteMarkerProps = {
  variant: MarkerVariant
  index?: number
  color?: string
}

const currentWrapperStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
}

const currentHaloStyle: CSSProperties = {
  position: 'absolute',
  width: '24px',
  height: '24px',
  borderRadius: '9999px',
  background: 'rgba(37,99,235,0.2)',
}

const currentDotStyle: CSSProperties = {
  width: '14px',
  height: '14px',
  borderRadius: '9999px',
  background: '#2563eb',
  border: '3px solid #ffffff',
  boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
}

function getOrderedMarkerStyle(color?: string): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '9999px',
    background: color ?? '#1d4ed8',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 700,
    border: '2px solid #ffffff',
    boxShadow: '0 4px 12px rgba(15,23,42,0.25)',
  }
}

export function RouteMarker({ variant, index, color }: RouteMarkerProps) {
  if (variant === 'current') {
    return (
      <div style={currentWrapperStyle}>
        <span style={currentHaloStyle} />
        <span style={currentDotStyle} />
      </div>
    )
  }

  return <div style={getOrderedMarkerStyle(color)}>{index ?? ''}</div>
}

export function renderRouteMarker(props: RouteMarkerProps) {
  return renderToStaticMarkup(<RouteMarker {...props} />)
}
