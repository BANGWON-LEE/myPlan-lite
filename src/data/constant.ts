export const initialPlaceObj = {
  name: '',
  path: {
    x: 0,
    y: 0,
  },
  address: '',
  roadAddress: '',
  category: '',
}

// 위치 저장 payload를 localStorage에 보관할 때 사용하는 키 (src/util/storage/positionStorage.ts)
export const POSITION_STORAGE_KEY = 'position'

// 마지막 위치 저장 요청 시각을 localStorage에 보관할 때 사용하는 키 (src/util/storage/positionStorage.ts)
export const REQUEST_TIME_KEY = 'requestTime'

// 위치 정보를 다시 저장하기 위한 최소 간격 5분 (src/util/storage/positionStorage.ts)
export const FIVE_MINUTES_MS = 5 * 60 * 1000
