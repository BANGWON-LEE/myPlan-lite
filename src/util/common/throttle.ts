export type ThrottledFunction<TArgs extends unknown[]> = ((
  ...args: TArgs
) => void) & {
  cancel: () => void
}

export function throttle<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  waitMs: number,
): ThrottledFunction<TArgs> {
  let lastInvokedAt = 0

  const invoke = (...args: TArgs) => {
    lastInvokedAt = performance.now()
    fn(...args)
  }

  const throttled = ((...args: TArgs) => {
    const now = performance.now()
    if (now - lastInvokedAt < waitMs) return
    invoke(...args)
  }) as ThrottledFunction<TArgs>

  throttled.cancel = () => {
    lastInvokedAt = 0
  }

  return throttled
}
