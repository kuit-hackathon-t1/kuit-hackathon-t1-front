import { Link, useParams } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import { useTripReviewQuery } from "@/features/trip/queries/useTripReviewQuery";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";
import PageHeader from "@/shared/ui/PageHeader";

export default function TripReviewPage() {
  const { tripId } = useParams();
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const reviewQuery = useTripReviewQuery(userId, tripId ? Number(tripId) : undefined);
  const review = reviewQuery.data;

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
      <PageHeader title="여행 회고" description={review.trip.tripName} />
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
