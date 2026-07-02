import { useEffect, useState } from "react";

import { useAuthStore } from "@/features/auth/stores/authStore";
import { endTrip, getActiveTrip } from "@/features/trip/api/tripApi";
import ActiveTripHome from "@/features/trip/components/ActiveTripHome";
import BeforeTripHome from "@/features/trip/components/BeforeTripHome";
import type { Trip } from "@/features/trip/types/trip";
import PageHeader from "@/shared/ui/PageHeader";

export default function HomePage() {
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTrip() {
      if (!userId) return;
      setTrip(await getActiveTrip(userId));
      setIsLoading(false);
    }

    void loadTrip();
  }, [userId]);

  async function handleEndTrip() {
    if (!trip || !user) throw new Error("No active trip");
    const endedTrip = await endTrip(trip.id, user.userId);
    setTrip(null);
    return endedTrip;
  }

  if (!user) return null;

  return (
    <>
      <PageHeader title={`${user.nickname}님의 채집 홈`} description="현재 여행 상태에 맞춰 다음 행동을 이어갑니다." />
      {isLoading ? (
        <p className="text-sm text-neutral-500">불러오는 중...</p>
      ) : trip ? (
        <ActiveTripHome trip={trip} onEndTrip={handleEndTrip} />
      ) : (
        <BeforeTripHome />
      )}
    </>
  );
}
