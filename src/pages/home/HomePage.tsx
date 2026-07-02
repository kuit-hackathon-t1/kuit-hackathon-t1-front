import { useAuthStore } from "@/features/auth/stores/authStore";
import ActiveTripHome from "@/features/trip/components/ActiveTripHome";
import BeforeTripHome from "@/features/trip/components/BeforeTripHome";
import { useCurrentTripQuery } from "@/features/trip/queries/useCurrentTripQuery";
import { useEndTripMutation } from "@/features/trip/queries/useEndTripMutation";
import PageHeader from "@/shared/ui/PageHeader";

export default function HomePage() {
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const currentTripQuery = useCurrentTripQuery(userId);
  const endTripMutation = useEndTripMutation(userId);
  const trip = currentTripQuery.data?.hasActiveTrip ? currentTripQuery.data.trip : null;

  async function handleEndTrip() {
    if (!trip || !user) throw new Error("No active trip");
    return endTripMutation.mutateAsync(trip.tripId);
  }

  if (!user) return null;

  return (
    <>
      <PageHeader title={`${user.nickname}님의 채집 홈`} description="현재 여행 상태에 맞춰 다음 행동을 이어갑니다." />
      {currentTripQuery.isLoading ? (
        <p className="text-sm text-neutral-500">불러오는 중...</p>
      ) : currentTripQuery.isError ? (
        <p className="text-sm text-red-600">
          {currentTripQuery.error instanceof Error ? currentTripQuery.error.message : "여행 정보를 불러오지 못했습니다."}
        </p>
      ) : trip ? (
        <ActiveTripHome trip={trip} onEndTrip={handleEndTrip} />
      ) : (
        <BeforeTripHome />
      )}
    </>
  );
}
