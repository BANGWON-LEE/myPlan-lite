# RoutePlace 버그 대응 기록 (2026-02-17)

## 1) 카테고리 인덱스 매칭 오류

- 파일: `src/features/Route/components/RoutePlace.tsx`
- 원인:
  - `routeArr`는 `meal, coffee, pharmacy, shopping` 고정 순서로 렌더링
  - `routeArrSize`에서 `.filter(Boolean)`으로 길이 0 카테고리를 제거
  - 결과적으로 `routeArrSize[index]`와 `routePlaceIdxList[index]`가 다른 카테고리를 가리킬 수 있었음
- 조치:
  - `routeArrSize`에서 `.filter(Boolean)` 제거
  - 카테고리별 인덱스 비교가 동일한 순서를 기준으로 동작하도록 수정

## 2) `poi-cache` 누락/오염 시 런타임 에러 가능성

- 파일: `src/features/Route/components/RoutePlace.tsx`
- 원인:
  - `drawMarker`에서 `position.coords`를 바로 접근
  - `localStorage`의 `poi-cache`가 없거나 잘못된 구조면 `null` 접근 에러 발생 가능
- 조치:
  - `getPositionFromStorage`에 JSON 파싱 예외 처리 및 스키마 검증 추가
  - 캐시가 없거나 유효하지 않으면 `navigator.geolocation`으로 현재 위치 조회
  - 조회 성공 시 `poi-cache`에 재저장 후 기존 흐름 계속 진행
  - 조회 실패 시 크래시 없이 종료

## 검증

- `npm run -s lint` 실행 기준:
  - 신규 에러 없음
  - 기존 경고만 유지

## 3) 오늘 추가 작업 내역 (커밋 기준)

- `src/stores/useRouteStore.ts`
  - `initialIdx`의 `set` 콜백에서 불필요한 `state` 타입 선언을 제거하고 객체 직접 전달 방식으로 단순화
- `src/features/Route/components/RouteBottom.tsx`
  - 사용하지 않는 `useRoutePlaceIdxStore` import 제거
- `src/features/plan/components/PlanMain.tsx`
  - 사용하지 않는 `TreePine`, `Navigation` 아이콘 import 제거
- `src/util/common/common.ts`
  - 반환값을 사용하지 않는 반복 로직을 `map` -> `forEach`로 변경
  - `default` 분기의 불필요한 `null` 표현을 `return`으로 정리
- `src/features/Route/components/RouteMap.tsx`
  - `useEffect` 의존성 배열을 `[]`에서 `[position, setPosition]`으로 보완해 훅 규칙 준수

### 3-1) 의존성 배열 관련 논의 내용 (추가)

- 대상: `src/features/Route/components/RouteMap.tsx`
- 배경:
  - `useEffect(..., [])` 상태에서 effect 내부에서 `position`, `setPosition`을 참조하고 있어 ESLint `react-hooks/exhaustive-deps` 경고가 발생
  - 단순히 경고만 끄기보다, 참조 값과 의존성 배열을 일치시키는 방향으로 정리 필요
- 핵심 논의 포인트:
  - `[position, setPosition]`를 넣었을 때 effect 재실행으로 인해 무한 반복이 생기지 않는지 확인
  - `if (!position) return` 가드가 있어 `position`이 없을 때는 early return 처리
  - `setPosition(position)` 호출은 동일 값 기준으로 실질 상태 변경이 없어서 반복 업데이트로 이어지지 않음
  - `setPosition`은 zustand setter로 참조 안정성이 높아 의존성 배열 포함 시에도 부작용 없음
- 결론:
  - 훅 규칙을 지키면서 동작 안정성을 유지하기 위해 `[position, setPosition]` 채택
  - 린트 경고 억제(주석/disable) 방식은 사용하지 않음

### 3-2) `queryPurposes` 관련 논의 내용 (추가)

- 대상: `src/features/Route/components/RoutePlace.tsx`
- 배경:
  - 기존에는 `const purposesArr = formatStringToArray(queryPurposes)`를 컴포넌트 상단에서 만들고,
    `queryKey: ['place', position, purposesArr, queryTime]`에 배열 자체를 넣고 있었음
  - 배열은 매 렌더마다 새 참조가 만들어질 수 있어, 값이 같아도 쿼리 키가 불안정해질 가능성을 함께 검토
- 핵심 논의 포인트:
  - React Query 키에는 파생 배열보다 원본 입력값(`queryPurposes`)을 넣는 편이 의도와 추적성이 명확함
  - 실제 API 호출 직전에만 `formatStringToArray(queryPurposes)`를 수행하면, 키 안정성과 변환 시점을 분리 가능
  - `enabled` 조건도 동일하게 `queryPurposes` 기반으로 평가해 조건/키 기준을 일치시키는 것이 안전함
- 반영:
  - `queryKey`를 `['place', position, queryPurposes, queryTime]`로 변경
  - `queryFn` 내부와 데이터 가공 시점에서 `purposesArr`를 계산하도록 이동
  - effect 의존성에도 `queryPurposes`를 포함해 URL 파라미터 변경 시 재가공이 누락되지 않게 정리
