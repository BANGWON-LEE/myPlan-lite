import { POSITION_QUERY_KEY } from '@/lib/queryKeys'
import { useQuery } from '@tanstack/react-query'
import {
  getCurrentPositionWithFallback,
  SmartLocationResult,
} from '../location/location'

export function useCurrentPositionQuery() {
  return useQuery<
    // GeolocationPosition,
    SmartLocationResult,
    globalThis.Error | GeolocationPositionError
  >({
    queryKey: POSITION_QUERY_KEY,
    queryFn: async () => await getCurrentPositionWithFallback(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}
