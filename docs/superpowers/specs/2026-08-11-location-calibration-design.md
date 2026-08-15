# Location Calibration Design

## Goal

Reduce current-location marker jumps from noisy `watchPosition` updates by routing every live coordinate through a small calibration pipeline before updating the Naver Maps marker.

## Architecture

Location calibration lives under `src/util/location/calibration/` as pure TypeScript functions. `RouteMap.tsx` stays responsible for geolocation watching and marker updates, while the calibration module owns movement-mode detection and coordinate smoothing.

## Components

- `types.ts` defines shared coordinate, sample, mode, and calibration state types.
- `geo.ts` calculates distance, elapsed time, and speed between samples.
- `detectMovementMode.ts` decides whether recent movement should be treated as `walking` or `driving` when the requested mode is `auto`.
- `walkingCalibration.ts` applies conservative smoothing for low-speed movement and noisy indoor/subway-like updates.
- `drivingCalibration.ts` allows faster movement while still dampening low-accuracy jumps.
- `calibratePosition.ts` is the single entry function used by `watchPosition`.
- `index.ts` exports the public calibration API.

## Data Flow

1. `RouteMap.tsx` receives a `GeolocationPosition` from `navigator.geolocation.watchPosition`.
2. The callback converts it to a `LocationSample`.
3. `calibratePosition(sample, previousState, { mode: 'auto' })` runs.
4. `detectMovementMode` uses recent samples, calculated speed, browser speed if available, and accuracy to choose `walking`, `driving`, or keep the previous resolved mode.
5. The selected calibration function returns a stable marker coordinate and updated state.
6. `RouteMap.tsx` applies the calibrated coordinate to the current-location marker.

## Mode Rules

- `walking`: average speed below `2.5m/s` or previous mode remains walking in the ambiguous range. Uses stronger smoothing and tighter jump limits.
- `driving`: average speed above `5m/s` or browser-reported speed above `5m/s`. Allows larger movement and faster marker following.
- `auto`: public input mode that delegates to `detectMovementMode`. It does not become a stored resolved mode; the stored mode is `walking` or `driving`.
- Ambiguous speed from `2.5m/s` through `5m/s` keeps the previous resolved mode to avoid rapid mode switching.
- Low accuracy above `80m` does not force a mode change and causes stronger smoothing.

## Error Handling

Invalid timing, missing previous sample, or zero elapsed time returns the current sample with initialized state. Missing `accuracy` is treated as acceptable but not high confidence. The module does not throw for normal browser geolocation shape differences.

## Testing

Vitest tests cover distance/speed helpers, movement-mode detection, walking jump dampening, driving follow behavior, low-accuracy smoothing, and the public `calibratePosition` state flow.

## Scope

This change only stabilizes the displayed current-location marker. It does not change route search origin, T Map requests, stored initial position, or permission fallback behavior.
