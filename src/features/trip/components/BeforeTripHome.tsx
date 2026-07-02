import { Link } from "react-router";

import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";

type BeforeTripHomeProps = {
  nickname: string;
};

export default function BeforeTripHome({ nickname }: BeforeTripHomeProps) {
  return (
    <div className="space-y-5">
      <header className="pt-2">
        <p className="text-sm text-gray-600">오늘의 도감</p>
        <h1 className="mt-1 text-2xl font-bold text-black-950">{nickname}님의 청춘도감</h1>
      </header>

      <section className="rounded-[32px] border border-primary/20 bg-primary-soft px-5 py-8 text-center">
        <BookPlaceholder />
        <h2 className="mt-7 text-xl font-bold text-black-950">아직 시작한 여행이 없어요</h2>
        <p className="mt-3 text-sm leading-6 text-black-700">새 여행을 만들고 미션을 뽑아 첫 청춘 조각을 채집해보세요.</p>
        <Link className="mt-7 block" to="/trips/new">
          <Button fullWidth size="lg">새 여행 출발하기</Button>
        </Link>
      </section>

      <Card className="rounded-[28px] border-gray-200 bg-white">
        <p className="text-sm font-semibold text-black-950">진행 중인 미션</p>
        <div className="mt-4 flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-sm text-off">
          여행을 시작하면 미션이 여기에 표시돼요
        </div>
      </Card>
    </div>
  );
}

function BookPlaceholder() {
  return (
    <div
      className="mx-auto flex h-44 w-full max-w-72 items-center justify-center rounded-[28px] border border-dashed border-primary/30 bg-white text-sm font-semibold text-primary shadow-card"
      style={{
        backgroundImage: "url('/images/home/open-book.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <span className="rounded-full bg-white/85 px-4 py-2">펼쳐진 도감</span>
    </div>
  );
}
