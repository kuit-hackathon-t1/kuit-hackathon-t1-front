import { Link } from "react-router";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col justify-between px-5 py-10">
      <section className="pt-16">
        <p className="text-sm font-semibold text-orange-500">청춘의 작은 여행 기록</p>

        <h1 className="mt-4 text-4xl font-bold leading-tight text-neutral-900">
          쓸모없는 시간을
          <br />
          여행처럼 남겨보세요
        </h1>

        <p className="mt-5 text-base leading-7 text-neutral-600">
          AI가 추천하는 작은 여행 미션을 시도하고, 못 한 미션도 타임캡슐로
          남겨보세요.
        </p>
      </section>

      <Link
        to="/travel-style"
        className="rounded-2xl bg-orange-500 px-5 py-4 text-center font-semibold text-white shadow-lg shadow-orange-200"
      >
        나의 여행 미션 시작하기
      </Link>
    </main>
  );
}