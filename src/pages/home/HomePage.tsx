import { useAuthStore } from "@/features/auth/stores/authStore";
import ActiveTripHome from "@/features/trip/components/ActiveTripHome";
import BeforeTripHome from "@/features/trip/components/BeforeTripHome";
import { useCurrentTripQuery } from "@/features/trip/queries/useCurrentTripQuery";

export default function HomePage() {
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const currentTripQuery = useCurrentTripQuery(userId);
  const trip = currentTripQuery.data?.hasActiveTrip ? currentTripQuery.data.trip : null;

  if (!user) return null;

  return (
    <div className="-mx-5 -my-6 min-h-dvh bg-[#FFFFF7] px-5 py-6">
      {currentTripQuery.isLoading ? (
        <p className="text-sm text-neutral-500">불러오는 중...</p>
      ) : currentTripQuery.isError ? (
        <p className="text-sm text-red-600">
          {currentTripQuery.error instanceof Error ? currentTripQuery.error.message : "여행 정보를 불러오지 못했습니다."}
        </p>
      ) : trip ? (
        <ActiveTripHome trip={trip} userId={userId} />
      ) : (
        <BeforeTripHome nickname={user.nickname} />
      )}
    </div>
  );
}
