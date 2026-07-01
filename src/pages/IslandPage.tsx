export default function IslandPage() {
  return (
    <main className="px-5 py-8">
      <h1 className="text-2xl font-bold">나의 섬</h1>
      <p className="mt-2 text-sm text-neutral-500">
        시도한 미션과 미뤄둔 미션이 오브젝트로 쌓이는 화면입니다.
      </p>

      <section className="mt-8 flex h-80 items-center justify-center rounded-[2rem] bg-sky-100">
        <div className="rounded-full bg-yellow-100 px-10 py-8 text-center">
          섬 일러스트 영역
        </div>
      </section>
    </main>
  );
}