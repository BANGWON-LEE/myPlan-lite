import axios from 'axios'

export async function getMyRouteList(
  position: GeolocationPosition,
  queryPurposes: string,
  queryTime: string
) {
  const latitude = decodeURIComponent(position.coords.latitude.toString())
  const longitude = decodeURIComponent(position.coords.longitude.toString())
  const purpose = queryPurposes
  const time = decodeURIComponent(queryTime)
  console.log('purpose', purpose)

  const res = await axios.get(
    `/api/searchLoc?latitude=${latitude}&longitude=${longitude}&purpose=${purpose}&time=${time}`
  )
  return res.data
}
