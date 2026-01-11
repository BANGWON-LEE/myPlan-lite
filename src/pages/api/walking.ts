import { tmapResponseWalk } from '@/types/routeType'
import { tMapFormatSpreadPath } from '@/util/route/RouteFunctions'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function getPathWalking(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers = { appkey: process.env.TMAP_APP_KEY }

  const requestData = req.body

  const result = await axios.post(
    'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result',
    requestData,
    { headers: headers }
  )
  console.log('resultDD', result.data.features)

  const walkPath = result.data.features.map(
    (result: tmapResponseWalk) => result.geometry.coordinates
  )

  const resultArr = tMapFormatSpreadPath(walkPath)

  return res
    .status(200)
    .json({ path: resultArr, summary: result.data.features[0].properties })
}
