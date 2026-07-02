import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { getMission } from "@/features/mission/api/missionApi";
import MissionStatusBadge from "@/features/mission/components/MissionStatusBadge";
import type { Mission } from "@/features/mission/types/mission";
import type { RecordResultStatus } from "@/features/record/types/record";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";
import PageHeader from "@/shared/ui/PageHeader";

export default function MissionProgressPage() {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const [mission, setMission] = useState<Mission | null>(null);

  useEffect(() => {
    async function loadMission() {
      if (!missionId) return;
      setMission(await getMission(Number(missionId)));
    }

    void loadMission();
  }, [missionId]);

  function moveToRecord(status: RecordResultStatus) {
    if (!mission) return;
    navigate(`/records/new?tripId=${mission.tripId}&missionId=${mission.id}&status=${status}`, {
      state: { tripId: mission.tripId, missionId: mission.id, status },
    });
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
          <Button onClick={() => moveToRecord("COMPLETED")}>장면 채집하기</Button>
          <Button variant="secondary" onClick={() => moveToRecord("FAILED")}>
            실패로 남기기
          </Button>
        </div>
      </Card>
    </>
  );
}
