import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function getSearchLoc(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text, time } = req.query

  const arr: string | string[] = text
    ?.split(',')
    .map(item => `query=${item}`)
    .join('&')

  console.log('received query:', arr)
  const result = await axios.get(
    `https://openapi.naver.com/v1/search/local?${arr}&time=${time}&display=10`,
    {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID!,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET!,
      },
    }
  )

  return res.status(200).json(result.data)
}
