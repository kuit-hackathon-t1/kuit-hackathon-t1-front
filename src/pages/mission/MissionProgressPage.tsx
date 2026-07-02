import { useNavigate, useParams } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import MissionStatusBadge from "@/features/mission/components/MissionStatusBadge";
import { useMissionDetailQuery } from "@/features/mission/queries/useMissionDetailQuery";
import type { RecordResultStatus } from "@/features/record/types/record";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";
import PageHeader from "@/shared/ui/PageHeader";

export default function MissionProgressPage() {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const user = useAuthStore((state) => state.currentUser);
  const numericMissionId = missionId ? Number(missionId) : undefined;
  const missionQuery = useMissionDetailQuery(user?.userId, numericMissionId);
  const mission = missionQuery.data;

  function moveToRecord(status: RecordResultStatus) {
    if (!mission) return;
    navigate(`/records/new?tripId=${mission.tripId}&missionId=${mission.missionId}&status=${status}`, {
      state: { tripId: mission.tripId, missionId: mission.missionId, status },
    });
  }

  if (missionQuery.isLoading) {
    return <p className="text-sm text-neutral-500">미션을 불러오는 중...</p>;
  }

  if (!mission) {
    return <EmptyState title="미션을 찾을 수 없습니다" description="미션 목록에서 다시 선택해주세요." />;
  }

  return (
    <>
      <PageHeader title="미션 진행" description="장면을 발견했다면 기록으로 남기세요." />
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-neutral-950">{mission.title}</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">{mission.description}</p>
          </div>
          <MissionStatusBadge status={mission.status} />
        </div>
        <div className="mt-6 grid gap-2">
          <Button onClick={() => moveToRecord("SUCCESS")}>장면 채집하기</Button>
          <Button variant="secondary" onClick={() => moveToRecord("FAILURE")}>
            실패로 남기기
          </Button>
        </div>
      </Card>
    </>
  );
}
