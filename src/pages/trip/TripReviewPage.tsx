import { useState } from "react";
import { Link, useParams } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import CollectionGrid from "@/features/collection/components/CollectionGrid";
import { useCollectionsQuery } from "@/features/collection/queries/useCollectionsQuery";
import type { CollectionStatus } from "@/features/collection/types/collection";
import { useTripReviewQuery } from "@/features/trip/queries/useTripReviewQuery";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";
import PageHeader from "@/shared/ui/PageHeader";
import Tabs, { type TabItem } from "@/shared/ui/Tabs";

type ReviewTab = "ALL" | CollectionStatus;

const tabItems: TabItem<ReviewTab>[] = [
  { value: "ALL", label: "전체" },
  { value: "SUCCESS", label: "성공" },
  { value: "FAILURE", label: "실패" },
];

function toCollectionStatus(tab: ReviewTab): CollectionStatus | undefined {
  return tab === "ALL" ? undefined : tab;
}

export default function TripReviewPage() {
  const { tripId } = useParams();
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const numericTripId = tripId ? Number(tripId) : undefined;
  const [tab, setTab] = useState<ReviewTab>("ALL");
  const reviewQuery = useTripReviewQuery(userId, numericTripId);
  const collectionsQuery = useCollectionsQuery(userId, numericTripId, toCollectionStatus(tab));
  const review = reviewQuery.data;
  const collections = collectionsQuery.data ?? [];

  if (reviewQuery.isLoading) {
    return <p className="text-sm text-neutral-500">불러오는 중...</p>;
  }

  if (reviewQuery.isError) {
    return (
      <EmptyState
        title="회고 정보를 불러오지 못했습니다"
        description={reviewQuery.error instanceof Error ? reviewQuery.error.message : "잠시 후 다시 시도해주세요."}
      />
    );
  }

  if (!review) {
    return <EmptyState title="회고 정보를 찾을 수 없습니다" description="홈에서 여행을 다시 확인해주세요." />;
  }

  return (
    <>
      <PageHeader title="여행 회고" description={review.tripName} />
      <div className="space-y-4">
        <Card>
          <p className="text-sm font-medium text-emerald-700">{review.region}</p>
          <h1 className="mt-2 text-xl font-bold text-neutral-950">{review.tripName}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {review.startDate} - {review.endDate}
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold text-neutral-950">{review.totalMissionCount}</p>
              <p className="mt-1 text-xs text-neutral-500">미션</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-700">{review.successMissionCount}</p>
              <p className="mt-1 text-xs text-neutral-500">성공</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-500">{review.failedMissionCount}</p>
              <p className="mt-1 text-xs text-neutral-500">실패</p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-neutral-500">채집 기록 {review.totalCollectionCount}개</p>
        </Card>

        <Tabs items={tabItems} value={tab} onChange={setTab} />
        {collectionsQuery.isLoading ? (
          <p className="text-sm text-neutral-500">채집 기록을 불러오는 중...</p>
        ) : collections.length > 0 ? (
          <CollectionGrid collections={collections} />
        ) : (
          <EmptyState title="채집 기록이 없습니다" description="이 여행에 저장된 채집 기록이 없습니다." />
        )}

        <Link to="/home">
          <Button className="w-full" variant="secondary">
            홈으로
          </Button>
        </Link>
      </div>
    </>
  );
}
