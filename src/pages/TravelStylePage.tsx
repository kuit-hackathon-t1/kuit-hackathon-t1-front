import { Link } from "react-router";

export default function TravelStylePage() {
  return (
    <main className="px-5 py-8">
      <h1 className="text-2xl font-bold">오늘은 어떤 여행을 해볼까요?</h1>
      <p className="mt-2 text-sm text-neutral-500">
        여행 분위기, 동행, 시간, 예산을 선택하는 화면입니다.
      </p>

      <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm">
        여행 스타일 선택 UI 예정
      </div>

      <Link
        to="/recommend"
        className="mt-8 block rounded-2xl bg-orange-500 px-5 py-4 text-center font-semibold text-white"
      >
        미션 추천받기
      </Link>
    </main>
  );
}