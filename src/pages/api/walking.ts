import { TmapCoordinate, walkDataType, WalkingApiType } from '@/types/routeType'
import { tMapFormatSpreadPath } from '@/util/route/RouteFunctions'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function getPathWalking(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const headers = { appkey: process.env.TMAP_APP_KEY }

  const requestData = req.body

  const pathArr: WalkingApiType[] = []
  formatWalkingPathData(requestData, pathArr)

  const resData = await Promise.all(
    pathArr.map(path =>
      axios.post(
        'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result',
        path,
        { headers: headers },
      ),
    ),
  )

  const walkPath = resData.map(result => {
    const walkData = result.data.features.map(
      (feature: {
        geometry: { coordinates: TmapCoordinate | TmapCoordinate[] }
      }) => feature.geometry.coordinates,
    )

    return tMapFormatSpreadPath(walkData)
  })

  const summaryPath = getWalkingSummary(resData)

  return res.status(200).json({ path: walkPath, summary: summaryPath })
}

export function getWalkingSummary(
  resData: Array<{ data: { features: unknown[] } }>,
) {
  return resData.map(result => {
    return result.data.features
  })
}

function formatWalkingPathData(
  requestData: walkDataType,
  pathArr: WalkingApiType[],
) {
  for (const [index, goalPoint] of requestData.routePoints.entries()) {
    pathArr.push({
      startX:
        index === 0
          ? requestData.startPoint.x
          : requestData.routePoints[index - 1].x,
      startY:
        index === 0
          ? requestData.startPoint.y
          : requestData.routePoints[index - 1].y,
      endX: goalPoint.x,
      endY: goalPoint.y,
      reqCoordType: 'WGS84GEO',
      resCoordType: 'WGS84GEO',
      startName:
        index === 0
          ? encodeURIComponent(requestData.startPoint.name)
          : encodeURIComponent(requestData.routePoints[index - 1].name),
      endName: encodeURIComponent(goalPoint.name),
    })
  }
}
