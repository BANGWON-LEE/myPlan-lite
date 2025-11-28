export type simplePosition = {
  x: number | string
  y: number | string
}

export interface routeSelectorType {
  title: string
  mapx: number
  mapy: number
  address: string
  roadAddress: string
  category: string
}

export interface SearchPlaceType extends routeSelectorType {
  link: string
  // category: string
  description: string
  telephone: string
  // address: string
  // roadAddress: string
}

export interface pathPropsDataType {
  data: SearchPlaceType
}
