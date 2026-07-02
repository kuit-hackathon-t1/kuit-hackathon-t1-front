import { useMemo, useState } from "react";
import { Link } from "react-router";

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
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const defaultTripId = useMemo(() => {
    if (trips.length === 0) return null;
    return (trips.find((trip) => trip.status === "ACTIVE") ?? trips[0]).tripId;
  }, [trips]);
  const effectiveSelectedTripId = trips.some((trip) => trip.tripId === selectedTripId) ? selectedTripId : defaultTripId;
  const selectedTrip = trips.find((trip) => trip.tripId === effectiveSelectedTripId) ?? null;
  const reviewTripId = selectedTrip?.status === "ENDED" ? selectedTrip.tripId : undefined;
  const reviewQuery = useTripReviewQuery(userId, reviewTripId);
  const collectionsQuery = useCollectionsQuery(userId, selectedTrip?.tripId);
  const collections = collectionsQuery.data ?? [];
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const selectedCollectionQuery = useCollectionDetailQuery(userId, selectedCollectionId ?? undefined);
  const stats = useMemo(() => (selectedTrip ? getTripStats(selectedTrip, reviewQuery.data) : null), [reviewQuery.data, selectedTrip]);

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
    <div className="-mx-5 -my-6 min-h-dvh bg-[#FFFFF7] pb-24">
      <header className="relative flex h-22 items-center justify-center border-b border-gray-200 bg-white px-5">
        <h1 className="text-xl font-bold text-black-950">채집 기록</h1>
        <button className="absolute right-5 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-gray-50 p-2" type="button" aria-label="기록 편집">
          <img className="h-full w-full" src="/images/icons/pencil.svg" alt="" onError={(event) => event.currentTarget.remove()} />
        </button>
      </header>

      <section className="bg-gray-200 px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {trips.map((trip) => (
            <button
              key={trip.tripId}
              className={cn(
                "flex h-30 w-16 shrink-0 flex-col items-center justify-between rounded-md border px-2 py-3 text-[11px] font-semibold shadow-sm",
                effectiveSelectedTripId === trip.tripId
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-gray-300 bg-[#FFFFF7] text-black-700",
              )}
              type="button"
              onClick={() => setSelectedTripId(trip.tripId)}
            >
              <span className="line-clamp-4 [writing-mode:vertical-rl]">{trip.tripName}</span>
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px]">
                {trip.status === "ACTIVE" ? "진행" : "종료"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 py-8">
        <h2 className="text-2xl font-bold text-black-950">{selectedTrip.tripName}</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-black-700">
          <span>{selectedTrip.region}</span>
          <span>·</span>
          <span>
            {selectedTrip.startDate} - {selectedTrip.endDate}
          </span>
          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-black-700">
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

        <p className="mt-10 text-sm leading-7 text-black-700">
          이번 여행에서 <strong className="font-bold text-primary">{stats.totalMissionCount}개</strong>의 미션을 시도했어요.
          <br />
          <strong className="font-bold text-primary">{stats.successMissionCount}개</strong>는 완료했고,{" "}
          <strong className="font-bold text-primary">{stats.failedMissionCount}개</strong>는 놓쳤어요.
          <br />
          하지만 놓친 장면까지 모두 청춘도감에 남아 있어요.
        </p>
        <p className="mt-4 text-xs text-gray-500">채집 기록 {stats.totalCollectionCount}개</p>
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
