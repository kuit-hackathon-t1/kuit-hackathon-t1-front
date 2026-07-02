import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import { getTripReview } from "@/features/trip/api/tripApi";
import type { TripReview } from "@/features/trip/types/trip";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";
import PageHeader from "@/shared/ui/PageHeader";

export default function TripReviewPage() {
  const { tripId } = useParams();
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const [review, setReview] = useState<TripReview | null>(null);

  useEffect(() => {
    async function loadReview() {
      if (!userId || !tripId) return;
      setReview(await getTripReview(Number(tripId), userId));
    }

    void loadReview();
  }, [tripId, userId]);

  if (!review) {
    return <EmptyState title="회고 정보를 찾을 수 없습니다" description="홈에서 여행을 다시 확인해주세요." />;
  }

  return (
    <>
      <PageHeader title="여행 회고" description={review.trip.title} />
      <Card>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-2xl font-bold text-neutral-950">{review.totalCollections}</p>
            <p className="mt-1 text-xs text-neutral-500">전체</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-700">{review.completedCount}</p>
            <p className="mt-1 text-xs text-neutral-500">완료</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-500">{review.failedCount}</p>
            <p className="mt-1 text-xs text-neutral-500">실패</p>
          </div>
        </div>
        <Link to="/home">
          <Button className="mt-6 w-full">홈으로</Button>
        </Link>
      </Card>
    </>
  );
}
