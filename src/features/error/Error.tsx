import Link from 'next/link'

export default function Error() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="mb-2 text-sm font-medium text-red-500">Location Error</p>
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          위치 정보를 사용할 수 없습니다
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          현재 위치 확인이 어렵습니다. 위치 권한이 꺼져 있거나,
          <br />
          현 위치가 한국이 아닌 경우 발생할 수 있습니다.
        </p>

        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
