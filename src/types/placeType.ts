export interface TmapPoiResponse {
  searchPoiInfo: {
    count: string // "20"
    page: string // "1"
    pois: {
      poi: TmapPoiItem[]
    }
    totalCount: string // "1747"
  }
}

export interface TmapPoiItem extends placeType {
  id: string
  pkey: string
  navSeq: string
  collectionType: string
  name: string
  frontLat?: string
  frontLon?: string
  noorLat?: string
  noorLon?: string
  upperAddrName?: string
  middleAddrName?: string
  lowerAddrName?: string
  detailAddrName?: string
  mlClass?: string
  radius: string
}

export type placeType = {
  name: string
  middleBizName: string
  telNo: string
  radius: string
  newAddressList: {
    newAddress: {
      fullAddressRoad: string
    }[]
  }
}

export type RoutePlaceType = {
  routeArr: placeType[]
}
