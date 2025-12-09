export async function getMyRouteList(
  position: GeolocationPosition,
  queryPurposes: string,
  queryTime: string
) {
  const latitude = position.coords.latitude
  const longitude = position.coords.longitude

  console.log('queryPurposes', queryPurposes)
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    purpose: queryPurposes, // "커피" 그대로 넣어도 fetch가 자동 인코딩
    time: queryTime,
  })

  const res = await fetch(`/api/searchLoc?${params.toString()}`, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error('API error')
  }

  return res.json()
}
