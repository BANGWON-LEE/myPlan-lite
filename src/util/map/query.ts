import { POSITION_QUERY_KEY } from '@/lib/queryKeys'
import { useQuery } from '@tanstack/react-query'
import { getCurrentPositionPromise } from './mapFunctions'

export function useCurrentPositionQuery() {
  return useQuery<
    GeolocationPosition,
    globalThis.Error | GeolocationPositionError
  >({
    queryKey: POSITION_QUERY_KEY,
    queryFn: async () => await getCurrentPositionPromise(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}
