'use client'

import { useEffect, useMemo, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const DISMISS_KEY = 'pwa_install_notice_dismissed'

function isIosSafari() {
  if (typeof window === 'undefined') return false

  const ua = window.navigator.userAgent
  const isIos = /iPhone|iPad|iPod/.test(ua)
  const isWebKit = /WebKit/.test(ua)
  const isCriOS = /CriOS/.test(ua)
  const isFxiOS = /FxiOS/.test(ua)

  return isIos && isWebKit && !isCriOS && !isFxiOS
}

function isInStandaloneMode() {
  if (typeof window === 'undefined') return false

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export default function PwaInstallNotice() {
  // 사용자가 설치 안내 배너를 닫았는지 여부 (localStorage로 유지)
  const [dismissed, setDismissed] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.localStorage.getItem(DISMISS_KEY) === 'true',
  )
  // 현재 앱이 이미 설치(standalone 모드)되었는지 여부
  const [isInstalled, setIsInstalled] = useState(() => isInStandaloneMode())
  // iOS Safari 환경인지 여부 (iOS는 beforeinstallprompt 미지원)
  const isIos = isIosSafari()
  // beforeinstallprompt 이벤트를 저장해두었다가 버튼 클릭 시 prompt() 실행
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }

    const onAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  const showNotice = useMemo(() => {
    if (dismissed || isInstalled) return false
    if (isIos) return true

    return deferredPrompt !== null
  }, [deferredPrompt, dismissed, isInstalled, isIos])

  const closeNotice = () => {
    window.localStorage.setItem(DISMISS_KEY, 'true')
    setDismissed(true)
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  if (!showNotice) return null

  return (
    <section
      className="mb-6 rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-sm"
      aria-label="앱 설치 안내"
    >
      <p className="mb-3 text-sm text-slate-700">
        {isIos
          ? '아이폰에서는 공유 버튼을 누른 뒤 "홈 화면에 추가"를 선택해 설치할 수 있어요.'
          : '앱으로 설치하면 더 빠르게 열 수 있어요.'}
      </p>
      <div className="flex gap-2">
        {!isIos && deferredPrompt && (
          <button
            type="button"
            onClick={handleInstall}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
          >
            앱 설치
          </button>
        )}
        <button
          type="button"
          onClick={closeNotice}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600"
        >
          닫기
        </button>
      </div>
    </section>
  )
}
