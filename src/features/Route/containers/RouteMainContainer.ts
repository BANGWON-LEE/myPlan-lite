import axios from 'axios'

export async function getMyRouteList(
  myLoc: string,
  queryPurposes: string,
  queryTime: string
) {
  const resultQueryStr = [myLoc, queryPurposes]
  const res = await axios.get(
    `/api/searchLoc?text=${resultQueryStr.join(',')}&time=${encodeURIComponent(
      queryTime
    )}`
  )
  return res.data
}
