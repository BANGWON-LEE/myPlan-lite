import axios from 'axios'

export async function getMyRouteList(
  position: GeolocationPosition | null,
  queryPurposes: string[],
  queryTime: string
) {
  const latitude = position?.coords.latitude
  const longitude = position?.coords.longitude

  //

  const res = await Promise.all(
    queryPurposes.map(purpose =>
      axios.get(
        `/api/searchLoc?latitude=${latitude}&longitude=${longitude}&purpose=${purpose}&time=${queryTime}`
      )
    )
  )

  return res
}
