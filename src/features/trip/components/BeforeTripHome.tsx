import { useState } from "react";
import { Link } from "react-router";

import Button from "@/shared/ui/Button";

type BeforeTripHomeProps = {
  nickname: string;
};

export default function BeforeTripHome({ nickname }: BeforeTripHomeProps) {
  return (
   <div
      className="flex min-h-[calc(100dvh-64px)] flex-col px-5 pb-6 pt-8"
      style={{ background: "linear-gradient(180deg, #FBFCF2 23.73%, #008F0E 297.71%)" }}
    >
      <header className="pt-8">
        <p className="text-xs font-medium leading-5 text-black-950">
          <span className="font-bold">{nickname}님</span>의 청춘도감
        </p>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold leading-9 text-black-950">아직 시작한 여행이 없어요</h1>
        <p className="mt-1 text-xs leading-5 text-black-700">여행을 시작하고, 청춘 조각을 채집해보세요</p>
        <BookImage />
      </section>

      <div className="mt-auto pb-6">
        <Link className="mt-7 block" to="/trips/new">
          <Button fullWidth size="lg">
            새 여행 출발하기
          </Button>
        </Link>
      </div>
    </div>
  );
}

function BookImage() {
  const [hasImage, setHasImage] = useState(true);

  return (
    <div className="mt-8 flex h-[210px] w-full max-w-[280px] items-center justify-center">
      {hasImage ? (
        <img
          className="h-full w-full object-contain"
          src="/images/home/open-book.png"
          alt="펼쳐진 청춘도감"
          onError={() => setHasImage(false)}
        />
      ) : (
        <div className="flex h-44 w-full items-center justify-center rounded-[28px] border border-dashed border-primary/30 bg-white text-sm font-semibold text-primary shadow-card">
          펼쳐진 도감
        </div>
      )}
    </div>
  );
}
