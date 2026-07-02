import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { getLocalImage } from "@/features/collection/lib/localImageStorage";
import { useCollectionDetailQuery } from "@/features/collection/queries/useCollectionDetailQuery";
import { useCollectionsQuery } from "@/features/collection/queries/useCollectionsQuery";
import type { CollectionDetail, CollectionListItem } from "@/features/collection/types/collection";
import { useCurrentTripQuery } from "@/features/trip/queries/useCurrentTripQuery";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";

export default function CollectionListPage() {
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const currentTripQuery = useCurrentTripQuery(userId);
  const trip = currentTripQuery.data?.hasActiveTrip ? currentTripQuery.data.trip : null;
  const collectionsQuery = useCollectionsQuery(userId, trip?.tripId);
  const collections = collectionsQuery.data ?? [];
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const selectedCollectionQuery = useCollectionDetailQuery(userId, selectedCollectionId ?? undefined);

  if (currentTripQuery.isLoading) {
    return <p className="text-sm text-neutral-500">불러오는 중...</p>;
  }

  if (!trip) {
    return (
      <EmptyState
        title="진행 중인 여행이 없습니다"
        description="여행을 시작하고 미션을 기록하면 채집 기록이 채워집니다."
        action={
          <Link to="/trips/new">
            <Button>새 여행 만들기</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="-mx-5 -my-6 min-h-dvh bg-[#FFFFF7] pb-24">
      <header className="relative flex h-22 items-center justify-center border-b border-gray-200 bg-white px-5">
        <h1 className="text-xl font-bold text-black-950">채집 기록</h1>
        <button className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl text-gray-500" type="button" aria-label="기록 편집">
          ♧
        </button>
      </header>

      <section className="bg-gray-200 px-4 py-10">
        {collectionsQuery.isLoading ? (
          <p className="text-sm text-gray-600">채집 기록을 불러오는 중...</p>
        ) : collections.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {collections.map((collection) => (
              <ShelfSpecimen
                key={collection.collectionId}
                collection={collection}
                onClick={() => setSelectedCollectionId(collection.collectionId)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-gray-400 bg-white/50 text-sm text-gray-600">
            아직 선반에 꽂힌 조각이 없어요
          </div>
        )}
      </section>

      <section className="px-5 py-8">
        <h2 className="text-2xl font-bold text-black-950">{trip.tripName}</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-black-700">
          <span>{trip.region}</span>
          <span>·</span>
          <span>
            {trip.startDate} - {trip.endDate}
          </span>
          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-black-700">
            {trip.companionType === "ALONE" ? "혼자" : "함께"}
          </span>
        </div>

        <div
          className="mt-12 flex h-56 items-center justify-center rounded-[28px] border border-dashed border-primary/30 bg-white text-sm font-semibold text-primary shadow-card"
          style={{
            backgroundImage: "url('/images/home/open-book.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <span className="rounded-full bg-white/85 px-4 py-2">여행 도감</span>
        </div>

        <p className="mt-10 text-sm leading-7 text-black-700">
          이번 여행에서 {user?.nickname ?? "채집가"}님은{" "}
          <strong className="font-bold text-primary">{trip.missionSummary.totalCount}개</strong>의 미션을 시도했어요.
          <br />
          <strong className="font-bold text-primary">{trip.missionSummary.successCount}개</strong>는 완료했고,{" "}
          <strong className="font-bold text-primary">{trip.missionSummary.failedCount}개</strong>는 놓쳤어요.
          <br />
          하지만 놓친 장면까지 모두 청춘도감에 남아 있어요.
        </p>
      </section>

      {selectedCollectionId ? (
        <CollectionPreviewDialog
          collection={selectedCollectionQuery.data ?? null}
          isLoading={selectedCollectionQuery.isLoading}
          onClose={() => setSelectedCollectionId(null)}
        />
      ) : null}
    </div>
  );
}

function ShelfSpecimen({ collection, onClick }: { collection: CollectionListItem; onClick: () => void }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadImage() {
      setImageUrl(null);
      if (!collection.imageId) return;
      const localImage = await getLocalImage(collection.imageId);
      if (!localImage || cancelled) return;
      objectUrl = URL.createObjectURL(localImage.blob);
      setImageUrl(objectUrl);
    }

    void loadImage();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [collection.imageId]);

  return (
    <button
      className="flex h-28 w-16 shrink-0 flex-col items-center justify-between rounded-md border border-primary bg-[#FFFFF7] px-1 py-2 text-[11px] font-semibold text-black-950 shadow-sm"
      type="button"
      onClick={onClick}
    >
      <span className="[writing-mode:vertical-rl]">{collection.missionTitle}</span>
      <div className="h-8 w-8">
        <SpecimenImage imageUrl={imageUrl} cropType={collection.cropType} status={collection.status} alt={collection.missionTitle} />
      </div>
    </button>
  );
}

function CollectionPreviewDialog({
  collection,
  isLoading,
  onClose,
}: {
  collection: CollectionDetail | null;
  isLoading: boolean;
  onClose: () => void;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadImage() {
      setImageUrl(null);
      if (!collection?.imageId) return;
      const localImage = await getLocalImage(collection.imageId);
      if (!localImage || cancelled) return;
      objectUrl = URL.createObjectURL(localImage.blob);
      setImageUrl(objectUrl);
    }

    void loadImage();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [collection?.imageId]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] mx-auto flex w-full max-w-[430px] items-end justify-center bg-black/20 px-5 pb-24 pt-6">
      <Card className="max-h-[76dvh] w-full max-w-[360px] overflow-y-auto rounded-[28px] border-gray-200 bg-white p-5 shadow-card">
        <button className="text-2xl text-gray-500" type="button" aria-label="닫기" onClick={onClose}>
          ×
        </button>
        {isLoading ? (
          <p className="mt-8 text-center text-sm text-gray-600">채집 조각을 불러오는 중...</p>
        ) : collection ? (
          <>
            <div className="mx-auto mt-8 w-48">
              <SpecimenImage imageUrl={imageUrl} cropType={collection.cropType} status={collection.status} alt={collection.missionTitle} />
            </div>
            <div className="mt-6 rounded-[22px] bg-white p-4 shadow-card">
              <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600">
                {collection.status === "SUCCESS" ? "성공" : "실패"}
              </span>
              <h2 className="mt-3 text-2xl font-bold leading-9 text-black-700">{collection.missionTitle}</h2>
              <p className="mt-8 text-sm leading-7 text-black-700">
                {collection.memo || "한줄 소감이 아직 없어요."}
              </p>
            </div>
          </>
        ) : (
          <p className="mt-8 text-center text-sm text-gray-600">채집 기록을 찾지 못했어요.</p>
        )}
      </Card>
    </div>
  );
}
