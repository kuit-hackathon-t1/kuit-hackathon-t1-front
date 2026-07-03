export default function MissionDrawLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-[#FFFFF7] px-6 text-center">
      <h2 className="text-lg font-bold text-black-950">미션을 뽑고 있어요</h2>
      <div className="relative mt-10 h-32 w-64">
        <div className="absolute left-3 top-5 h-24 w-56 -rotate-6 rounded-[18px] bg-gray-100 shadow-card" />
        <div className="absolute left-6 top-2 h-24 w-56 rotate-3 rounded-[18px] bg-gray-100 shadow-card" />
        <div className="absolute left-0 top-4 h-24 w-60 rounded-[18px] border border-gray-200 bg-white p-4 text-left shadow-card">
          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">수집</span>
          <p className="mt-3 text-lg font-bold text-black-950">이상한 색 찾기</p>
          <p className="mt-3 text-xs leading-5 text-black-700">이 동네에서 가장 이상한 색을 찾아보아요.</p>
        </div>
      </div>
      <div className="mt-12 flex items-center justify-center gap-1.5" aria-label="로딩 중">
        <span className="h-2.5 w-2.5 animate-bounce rounded-sm bg-[#9B5CFF]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300 [animation-delay:120ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300 [animation-delay:240ms]" />
      </div>
    </div>
  );
}
