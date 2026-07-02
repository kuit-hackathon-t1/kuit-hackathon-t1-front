import { useState } from "react";
import { Link } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import CollectionGrid from "@/features/collection/components/CollectionGrid";
import { useCollectionsQuery } from "@/features/collection/queries/useCollectionsQuery";
import type { CollectionStatus } from "@/features/collection/types/collection";
import { useCurrentTripQuery } from "@/features/trip/queries/useCurrentTripQuery";
import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";
import PageHeader from "@/shared/ui/PageHeader";
import Tabs, { type TabItem } from "@/shared/ui/Tabs";

type CollectionTab = "ALL" | CollectionStatus;

const tabItems: TabItem<CollectionTab>[] = [
  { value: "ALL", label: "전체" },
  { value: "SUCCESS", label: "성공" },
  { value: "FAILURE", label: "실패" },
];

function toCollectionStatus(tab: CollectionTab): CollectionStatus | undefined {
  return tab === "ALL" ? undefined : tab;
}

export default function CollectionListPage() {
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const [tab, setTab] = useState<CollectionTab>("ALL");
  const currentTripQuery = useCurrentTripQuery(userId);
  const trip = currentTripQuery.data?.hasActiveTrip ? currentTripQuery.data.trip : null;
  const collectionsQuery = useCollectionsQuery(userId, trip?.tripId, toCollectionStatus(tab));
  const collections = collectionsQuery.data ?? [];

  if (currentTripQuery.isLoading) {
    return <p className="text-sm text-neutral-500">불러오는 중...</p>;
  }

  if (!trip) {
    return (
      <EmptyState
        title="진행 중인 여행이 없습니다"
        description="여행을 시작하고 미션을 기록하면 채집통이 채워집니다."
        action={
          <Link to="/trips/new">
            <Button>새 여행 만들기</Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <PageHeader title={`${trip.tripName} 채집통`} description="성공한 미션은 선명하게, 실패한 미션은 흐릿하게 보입니다." />
      <Tabs items={tabItems} value={tab} onChange={setTab} />
      <div className="mt-4">
        {collectionsQuery.isLoading ? (
          <p className="text-sm text-neutral-500">채집 기록을 불러오는 중...</p>
        ) : collections.length > 0 ? (
          <CollectionGrid collections={collections} />
        ) : (
          <EmptyState
            title="아직 채집 기록이 없습니다"
            description="미션을 시작하고 사진 조각을 저장하면 이곳에 모입니다."
            action={
              <Link to="/missions">
                <Button>미션으로 이동</Button>
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}
