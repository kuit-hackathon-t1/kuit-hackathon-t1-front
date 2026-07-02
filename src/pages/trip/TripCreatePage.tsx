import { useNavigate } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import { createTrip } from "@/features/trip/api/tripApi";
import TripForm from "@/features/trip/components/TripForm";
import type { TripCreatePayload } from "@/features/trip/types/trip";
import PageHeader from "@/shared/ui/PageHeader";

export default function TripCreatePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.currentUser);

  async function handleSubmit(payload: TripCreatePayload) {
    await createTrip(payload);
    navigate("/home");
  }

  if (!user) return null;

  return (
    <>
      <PageHeader title="새 여행 만들기" description="여행 단위로 미션과 채집 기록을 묶습니다." />
      <TripForm userId={user.userId} onSubmit={handleSubmit} />
    </>
  );
}
