import { PlaceApiDataType, PlaceArgType } from '@/types/placeType'
import { formatStringToArray } from '@/util/common/common'
import { useQuery } from '@tanstack/react-query'
import { getMyRouteList } from '../containers/RouteMainContainer'
import {
  RoutePoint,
  tmapWalkingRouteResponseType,
  WalkQueryType,
} from '@/types/routeType'

export function usePlaceQuery({
  position,
  queryPurposes,
  queryTime,
}: PlaceArgType) {
  return useQuery<PlaceApiDataType[]>({
    queryKey: ['place', position, queryPurposes, queryTime],
    queryFn: async () => {
      const purposesArr = formatStringToArray(queryPurposes)
      return getMyRouteList(position, purposesArr, queryTime)
    },
    enabled: !!position && formatStringToArray(queryPurposes).length > 0,
    staleTime: 1000 * 60 * 5,
    placeholderData: prev => prev,
  })
}

export async function getWalkingArr(
  currentPoint: RoutePoint,
  selectedRoutePoints: RoutePoint[],
) {
  const path = await getWalkingPathArr(currentPoint, selectedRoutePoints)
  return path
}

async function getWalkingPathArr(
  currentPoint: RoutePoint,
  selectedRoutePoints: RoutePoint[],
) {
  const response = await fetch('/api/walking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      startPoint: currentPoint,
      routePoints: selectedRoutePoints,
      reqCoordType: 'WGS84GEO',
      resCoordType: 'WGS84GEO',
    }),
  })

  if (!response.ok) {
    throw new Error(`경로를 그리지 못했습니다.`)
  }

  return (await response.json()) as tmapWalkingRouteResponseType
}

export function useWalkQuery({
  selectedRoutePoints,
  getStartPosition,
  routeList,
  isStartPositionChanged,
}: WalkQueryType) {
  const enabledResult =
    Object.values(routeList).some(list => list.length > 1) ||
    isStartPositionChanged

  return useQuery<tmapWalkingRouteResponseType>({
    queryKey: ['walk', selectedRoutePoints, getStartPosition],
    queryFn: async () => {
      return getWalkingArr(getStartPosition, selectedRoutePoints)
    },
    enabled: enabledResult,
    staleTime: 1000 * 60 * 5,
    placeholderData: prev => prev,
  })
}
