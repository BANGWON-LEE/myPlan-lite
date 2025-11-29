import axios from 'axios'

export async function getMyRouteList(
  position: GeolocationPosition,
  queryPurposes: string,
  queryTime: string
) {
  const latitude = position.coords.latitude
  const longitude = position.coords.longitude

  const res = await axios.get(
    `/api/searchLoc?latitude=${latitude}&longitude=${longitude}&text=${queryPurposes}&time=${encodeURIComponent(
      queryTime
    )}`
  )
  return res.data
}
