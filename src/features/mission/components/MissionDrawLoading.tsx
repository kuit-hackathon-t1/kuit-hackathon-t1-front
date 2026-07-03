export default function MissionDrawLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
      <h2 className="text-lg font-bold text-black-950">미션을 뽑고 있어요</h2>
      <img
        className="mt-6 h-auto w-100"
        src="/images/mission/mission-card.png"
        alt="이상한 색 찾기 미션 카드 예시"
      />
      <div className="mt-6 flex items-center justify-center gap-1.5" aria-label="로딩 중">
        <span className="h-2.5 w-2.5 animate-bounce rounded-sm bg-[#9B5CFF]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300 [animation-delay:120ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300 [animation-delay:240ms]" />
      </div>
    </div>
  );
}
