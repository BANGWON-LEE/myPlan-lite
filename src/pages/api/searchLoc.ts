import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function getSearchLoc(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { latitude, longitude, text, time } = req.query

  console.log('pos into', latitude, text)

  const headers = { appkey: process.env.TMAP_APP_KEY }

  const result = await axios.get(
    `https://apis.openapi.sk.com/tmap/pois?searchKeyword=쉼터&searchType=all&centerLon=${longitude}&centerLat=${latitude}&radius=1`,

    { headers: headers }
  )

  return res.status(200).json(result.data)
}
