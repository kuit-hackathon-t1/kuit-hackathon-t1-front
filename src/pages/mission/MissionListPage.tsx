import { Link, useNavigate } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import MissionCard from "@/features/mission/components/MissionCard";
import MissionTabs, { type MissionTab } from "@/features/mission/components/MissionTabs";
import { useMissionListQuery } from "@/features/mission/queries/useMissionListQuery";
import { useRandomMissionMutation } from "@/features/mission/queries/useRandomMissionMutation";
import { useStartMissionMutation } from "@/features/mission/queries/useStartMissionMutation";
import type { Mission, MissionStatus } from "@/features/mission/types/mission";
import { useCurrentTripQuery } from "@/features/trip/queries/useCurrentTripQuery";
import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";
import PageHeader from "@/shared/ui/PageHeader";
import { useState } from "react";

function toMissionStatus(tab: MissionTab): MissionStatus | undefined {
  return tab === "ALL" ? undefined : tab;
}

export default function MissionListPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const [tab, setTab] = useState<MissionTab>("ALL");
  const currentTripQuery = useCurrentTripQuery(userId);
  const trip = currentTripQuery.data?.hasActiveTrip ? currentTripQuery.data.trip : null;
  const status = toMissionStatus(tab);
  const missionListQuery = useMissionListQuery(userId, trip?.tripId, status);
  const randomMissionMutation = useRandomMissionMutation(userId, trip?.tripId);
  const startMissionMutation = useStartMissionMutation(userId, trip?.tripId);
  const missions = missionListQuery.data ?? [];

  async function handleGenerate() {
    await randomMissionMutation.mutateAsync();
  }

  async function handleStart(mission: Mission) {
    const startedMission = await startMissionMutation.mutateAsync(mission.missionId);
    navigate(`/missions/${startedMission.missionId}/progress`);
  }

  if (currentTripQuery.isLoading) {
    return <p className="text-sm text-neutral-500">불러오는 중...</p>;
  }

  if (!trip) {
    return (
      <EmptyState
        title="먼저 여행을 시작해주세요"
        description="진행 중인 여행이 있어야 랜덤 미션을 뽑을 수 있습니다."
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
      <PageHeader
        title="미션"
        description={trip.tripName}
        action={
          <Button onClick={handleGenerate} disabled={randomMissionMutation.isPending}>
            랜덤 뽑기
          </Button>
        }
      />
      <MissionTabs value={tab} onChange={setTab} />
      {missionListQuery.isError ? (
        <p className="mt-4 text-sm text-red-600">
          {missionListQuery.error instanceof Error ? missionListQuery.error.message : "미션을 불러오지 못했습니다."}
        </p>
      ) : null}
      <div className="mt-4 space-y-3">
        {missionListQuery.isLoading ? (
          <p className="text-sm text-neutral-500">미션을 불러오는 중...</p>
        ) : missions.length > 0 ? (
          missions.map((mission) => <MissionCard key={mission.missionId} mission={mission} onStart={handleStart} />)
        ) : (
          <EmptyState title="미션이 없습니다" description="랜덤 미션을 뽑아 첫 채집을 시작하세요." />
        )}
      </div>
    </>
  );
}
