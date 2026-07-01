import { Link } from "react-router";

export default function MissionRecommendPage() {
  return (
    <main className="px-5 py-8">
      <h1 className="text-2xl font-bold">오늘의 여행 미션</h1>
      <p className="mt-2 text-sm text-neutral-500">
        선택한 조건에 맞는 미션 3개를 추천하는 화면입니다.
      </p>

      <div className="mt-8 space-y-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm">미션 카드 1</div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">미션 카드 2</div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">미션 카드 3</div>
      </div>

      <Link
        to="/missions"
        className="mt-8 block rounded-2xl bg-orange-500 px-5 py-4 text-center font-semibold text-white"
      >
        선택한 미션 시작하기
      </Link>
    </main>
  );
}