export interface tmapResponseWalk {
  geometry: {
    type: string
    coordinates: [number, number]
  }
}

export type tmapRoutePathType = {
  path: [[number, number]]
  summary: {
    description: string
    index: number
    name: string
    nextRoadName: string
    pointIndex: number
    pointType: string
    taxiFare: number
    totalDistance: number
    totalFare: number
    totalTime: number
    turnType: number
  }
}

// export type startInfoType = {
//   start: {
//     name: string
//     path: { x: number; y: number }
//     address: string
//     roadAddress: string
//     category: string
//   }
// }

export type startRouteType = {
  x: number
  y: number
}

export type goalRouteType = {
  x: number
  y: number
}

export type startInfoType = {
  start: {
    name: string
    path: { x: number; y: number }
    address: string
    roadAddress: string
    category: string
  }
}

export type infoType = {
  name: number
  start: {
    name: string
    path: { x: number; y: number }
    address: string
    roadAddress: string
    category: string
  }
}

export type goalInfoType = {
  goal: {
    name: string
    path: { x: number; y: number }
    address: string
    roadAddress: string
    category: string
  }
}
