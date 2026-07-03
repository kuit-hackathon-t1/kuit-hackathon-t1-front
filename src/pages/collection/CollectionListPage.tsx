import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import CollectionPreviewDialog from "@/features/collection/components/CollectionPreviewDialog";
import SpecimenBook from "@/features/collection/components/SpecimenBook";
import { useCollectionDetailQuery } from "@/features/collection/queries/useCollectionDetailQuery";
import { useCollectionsQuery } from "@/features/collection/queries/useCollectionsQuery";
import { companionLabels, type TripListItem } from "@/features/trip/types/trip";
import { useTripReviewQuery } from "@/features/trip/queries/useTripReviewQuery";
import { useTripsQuery } from "@/features/trip/queries/useTripsQuery";
import { cn } from "@/shared/lib/cn";
import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";

type TripStats = {
  successMissionCount: number;
  failedMissionCount: number;
  totalMissionCount: number;
  totalCollectionCount: number;
};

function getTripStats(trip: TripListItem, reviewStats?: Partial<TripStats>): TripStats {
  return {
    successMissionCount: reviewStats?.successMissionCount ?? trip.successMissionCount,
    failedMissionCount: reviewStats?.failedMissionCount ?? trip.failedMissionCount,
    totalMissionCount: reviewStats?.totalMissionCount ?? trip.totalMissionCount,
    totalCollectionCount: reviewStats?.totalCollectionCount ?? trip.totalCollectionCount,
  };
}

export default function CollectionListPage() {
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const tripsQuery = useTripsQuery(userId);
  const trips = useMemo(() => tripsQuery.data?.trips ?? [], [tripsQuery.data?.trips]);
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTripId = Number(searchParams.get("tripId")) || null;
  const [selectedTripId, setSelectedTripId] = useState<number | null>(requestedTripId);
  const defaultTripId = useMemo(() => {
    if (trips.length === 0) return null;
    return (trips.find((trip) => trip.status === "ACTIVE") ?? trips[0]).tripId;
  }, [trips]);
  const effectiveSelectedTripId = trips.some((trip) => trip.tripId === requestedTripId)
    ? requestedTripId
    : trips.some((trip) => trip.tripId === selectedTripId)
      ? selectedTripId
      : defaultTripId;
  const selectedTrip = trips.find((trip) => trip.tripId === effectiveSelectedTripId) ?? null;
  const reviewTripId = selectedTrip?.status === "ENDED" ? selectedTrip.tripId : undefined;
  const reviewQuery = useTripReviewQuery(userId, reviewTripId);
  const collectionsQuery = useCollectionsQuery(userId, selectedTrip?.tripId);
  const collections = collectionsQuery.data ?? [];
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const selectedCollectionQuery = useCollectionDetailQuery(userId, selectedCollectionId ?? undefined);
  const stats = useMemo(() => (selectedTrip ? getTripStats(selectedTrip, reviewQuery.data) : null), [reviewQuery.data, selectedTrip]);
  const attemptedMissionCount = stats ? stats.successMissionCount + stats.failedMissionCount : 0;

  if (tripsQuery.isLoading) {
    return <p className="text-sm text-neutral-500">불러오는 중...</p>;
  }

  if (trips.length === 0) {
    return (
      <EmptyState
        title="아직 저장된 여행이 없습니다"
        description="여행을 시작하고 첫 청춘 조각을 채집해보세요."
        action={
          <Link to="/trips/new">
            <Button>새 여행 만들기</Button>
          </Link>
        }
      />
    );
  }

  if (!selectedTrip || !stats) {
    return <EmptyState title="여행을 선택해주세요" description="상단 책갈피에서 여행을 선택하면 기록을 볼 수 있습니다." />;
  }

  return (
   <div className="min-h-[calc(100dvh-64px)] bg-[#FFFFF7] px-5">
      <header className="-mx-5 relative h-[91px] border-b border-gray-200 bg-[#FFFFF7] px-5">
        <h1 className="absolute bottom-[15px] left-1/2 -translate-x-1/2 text-subtitle-20 text-black-800">채집 기록</h1>
      </header>

      <section className="-mx-5 h-[139px] bg-gray-200 px-4">
        <div className="flex h-full items-end gap-1.5 overflow-x-auto">
          {trips.map((trip, index) => (
            <button
              key={trip.tripId}
              className={cn(
                "flex w-8 shrink-0 flex-col items-center justify-center rounded-[5px] border px-1 py-2 text-[10px] font-semibold text-white shadow-[2px_1px_5px_rgba(0,0,0,0.25)] transition-[height,background-color]",
                effectiveSelectedTripId === trip.tripId
                  ? "h-[104px] border-[#482317]"
                  : "h-[88px] border-[#603524]",
                index % 2 === 0 && effectiveSelectedTripId !== trip.tripId ? "h-[96px]" : "",
              )}
              style={{
                background:
                  "linear-gradient(to bottom, rgba(118, 118, 118, 0.20) 0%, rgba(118, 118, 118, 0.20) 100%), linear-gradient(to bottom, #4D1B0B 0%, #91462E 68.75%, #61230E 100%)",
              }}
              type="button"
              onClick={() => {
                setSelectedTripId(trip.tripId);
                setSearchParams({ tripId: String(trip.tripId) });
              }}
            >
              <span className="line-clamp-4 [writing-mode:vertical-rl]">{trip.tripName}</span>
              <span className="sr-only">
                {trip.status === "ACTIVE" ? "진행" : "종료"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="pt-8">
        <h2 className="font-jandari text-subtitle-26 text-black-950">{selectedTrip.tripName}</h2>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-body-12 text-black-700">
          <span>{selectedTrip.region} · {selectedTrip.startDate}-{selectedTrip.endDate}</span>
          <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[10px] font-semibold text-black-700">
            {companionLabels[selectedTrip.companionType]}
          </span>
        </div>

        {collectionsQuery.isError ? (
          <p className="mt-6 text-sm text-danger">
            {collectionsQuery.error instanceof Error ? collectionsQuery.error.message : "채집 기록을 불러오지 못했습니다."}
          </p>
        ) : null}

        <SpecimenBook collections={collections} onSelectCollection={setSelectedCollectionId} />

        {collectionsQuery.isLoading ? <p className="mt-4 text-sm text-gray-600">채집 기록을 불러오는 중...</p> : null}

        <p className="mt-8 text-body-12 leading-5 text-black-700">
          이번 여행에서 <strong className="font-bold text-primary">{attemptedMissionCount}개</strong>의 미션을 시도했어요.
          <br />
          <strong className="font-bold text-primary">{stats.successMissionCount}개</strong>는 완료했고,{" "}
          <strong className="font-bold text-primary">{stats.failedMissionCount}개</strong>는 놓쳤어요.
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
