import { Link } from "react-router";

export default function MissionBoardPage() {
  return (
    <main className="px-5 py-8">
      <h1 className="text-2xl font-bold">오늘의 여행 미션</h1>
      <p className="mt-2 text-sm text-neutral-500">
        선택한 미션을 확인하고 시도 여부를 기록하는 홈 화면입니다.
      </p>

      <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold">처음 보는 골목으로 15분 걷기</h2>
        <p className="mt-2 text-sm text-neutral-500">
          평소 지나치던 길을 여행 온 사람처럼 걸어보세요.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white">
            시도했어요
          </button>
          <button className="rounded-xl bg-orange-100 px-4 py-3 text-sm font-semibold text-orange-600">
            오늘은 못 했어요
          </button>
        </div>
      </div>

      <Link
        to="/island"
        className="mt-8 block rounded-2xl bg-neutral-900 px-5 py-4 text-center font-semibold text-white"
      >
        나의 섬 보러가기
      </Link>
    </main>
  );
}