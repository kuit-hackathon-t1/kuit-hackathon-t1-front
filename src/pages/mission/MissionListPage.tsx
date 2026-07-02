import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import { generateMission, getMissions, startMission } from "@/features/mission/api/missionApi";
import MissionCard from "@/features/mission/components/MissionCard";
import MissionTabs, { type MissionTab } from "@/features/mission/components/MissionTabs";
import type { Mission } from "@/features/mission/types/mission";
import { getActiveTrip } from "@/features/trip/api/tripApi";
import type { Trip } from "@/features/trip/types/trip";
import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";
import PageHeader from "@/shared/ui/PageHeader";

export default function MissionListPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [tab, setTab] = useState<MissionTab>("ALL");

  async function loadMissions(activeTrip: Trip) {
    setMissions(await getMissions(activeTrip.id));
  }

  useEffect(() => {
    async function load() {
      if (!userId) return;
      const activeTrip = await getActiveTrip(userId);
      setTrip(activeTrip);
      if (activeTrip) await loadMissions(activeTrip);
    }

    void load();
  }, [userId]);

  async function handleGenerate() {
    if (!user || !trip) return;
    await generateMission(user.userId, trip.id);
    await loadMissions(trip);
  }

  async function handleStart(mission: Mission) {
    if (!user) return;
    const startedMission = await startMission(mission.id, user.userId);
    navigate(`/missions/${startedMission.id}/progress`);
  }

  const visibleMissions = tab === "ALL" ? missions : missions.filter((mission) => mission.status === tab);

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
      <PageHeader title="미션" description={trip.title} action={<Button onClick={handleGenerate}>랜덤 뽑기</Button>} />
      <MissionTabs value={tab} onChange={setTab} />
      <div className="mt-4 space-y-3">
        {visibleMissions.length > 0 ? (
          visibleMissions.map((mission) => <MissionCard key={mission.id} mission={mission} onStart={handleStart} />)
        ) : (
          <EmptyState title="미션이 없습니다" description="랜덤 미션을 뽑아 첫 채집을 시작하세요." />
        )}
      </div>
    </>
  );
}
