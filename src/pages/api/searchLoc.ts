import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function getSearchLoc(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { latitude, longitude, purpose, time } = req.query

  const headers = { appkey: process.env.TMAP_APP_KEY }

  const result = await axios.get(
    `https://apis.openapi.sk.com/tmap/pois?searchKeyword=${purpose}&searchType=all&centerLon=${longitude}&centerLat=${latitude}&radius=1`,

    { headers: headers }
  )

  // console.log('result@', result.data)

  return res.status(200).json(result.data)
}

// 추천 경로 알려주기 (가까운 순, default)
// 현재 위치에서 가장 가까운 장소 값을 가져옴 --> 여기서 걷는 경로를 통해 polyLine 그리기
// 추가적으로 다른 목적이 더 있다면 해당 장소에서 또 가까운 장소를 추천 --> polyLine 그리기
