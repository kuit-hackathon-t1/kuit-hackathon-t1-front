import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import closeIcon from "@/assets/icons/close.svg";
import shuffleIcon from "@/assets/icons/shuffle.svg";
import { useAuthStore } from "@/features/auth/stores/authStore";
import MissionActionDialog from "@/features/mission/components/MissionActionDialog";
import MissionDrawFlow from "@/features/mission/components/MissionDrawFlow";
import MissionTabs, { type MissionTab } from "@/features/mission/components/MissionTabs";
import { getMissionCategoryMeta } from "@/features/mission/lib/missionCategory";
import { getMissionStatusMeta, isVisibleMissionStatus } from "@/features/mission/lib/missionStatus";
import { useMissionListQuery } from "@/features/mission/queries/useMissionListQuery";
import type { Mission, MissionStatus } from "@/features/mission/types/mission";
import { useCurrentTripQuery } from "@/features/trip/queries/useCurrentTripQuery";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";
import { cn } from "@/shared/lib/cn";
import PageHeader from "@/shared/ui/PageHeader";

function toMissionStatus(tab: MissionTab): MissionStatus | undefined {
  return tab === "ALL" ? undefined : tab;
}

export default function MissionListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const [tab, setTab] = useState<MissionTab>("ALL");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"SUCCESS" | "FAILURE" | null>(null);
  const currentTripQuery = useCurrentTripQuery(userId);
  const trip = currentTripQuery.data?.hasActiveTrip ? currentTripQuery.data.trip : null;
  const status = toMissionStatus(tab);
  const missionListQuery = useMissionListQuery(userId, trip?.tripId, status);
  const missions = (missionListQuery.data ?? []).filter((mission) => isVisibleMissionStatus(mission.status));
  const isDrawMode = searchParams.get("draw") === "1";

  function closeMissionDialog() {
    setSelectedMission(null);
    setSelectedStatus(null);
  }

  function openDrawMode() {
    setSearchParams({ draw: "1" }, { replace: true });
  }

  function closeDrawMode() {
    setSearchParams({}, { replace: true });
  }

  function moveToRecord(status: "SUCCESS" | "FAILURE") {
    if (!selectedMission || !trip) return;
    navigate(`/records/new?tripId=${trip.tripId}&missionId=${selectedMission.missionId}&status=${status}`, {
      state: { tripId: trip.tripId, missionId: selectedMission.missionId, status },
    });
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
   <div
      className={
        isDrawMode
          ? "h-dvh overflow-hidden px-5 py-4"
          : "min-h-[calc(100dvh-64px)] px-5 py-6"
      }
      style={{
        background: "linear-gradient(180deg, #FBFCF2 23.73%, #008F0E 297.71%)",
      }}
    >
      {isDrawMode ? (
        <MissionDrawFlow
          userId={userId}
          tripId={trip.tripId}
          autoStart
          onClose={closeDrawMode}
          onStarted={() => navigate("/home", { replace: true })}
        />
      ) : (
        <>
          <PageHeader title="미션 모아보기" />
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
              <MissionStack missions={missions} onOpen={setSelectedMission} />
            ) : (
              <EmptyState title="미션이 없습니다" description="랜덤 미션을 뽑아 첫 채집을 시작하세요." />
            )}
          </div>
          <div className="pointer-events-none fixed bottom-16 left-1/2 z-40 w-[calc(100%_-_40px)] max-w-[390px] -translate-x-1/2 pb-4">
            <Button
              className="pointer-events-auto relative w-full border-2 border-primary bg-white text-primary hover:bg-primary-soft"
              size="lg"
              onClick={openDrawMode}
            >
              <img className="absolute left-5 h-5 w-5" src={shuffleIcon} alt="" aria-hidden="true" />
              랜덤 미션 뽑기
            </Button>
          </div>
        </>
      )}

      {selectedMission?.status === "ACTIVE" ? (
        <MissionActionDialog
          mission={selectedMission}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          onClose={closeMissionDialog}
          onBack={() => setSelectedStatus(null)}
          onRecord={() => selectedStatus && moveToRecord(selectedStatus)}
        />
      ) : selectedMission ? (
        <MissionListDialog
          mission={selectedMission}
          onClose={closeMissionDialog}
          onGoCollections={() => navigate("/collections")}
        />
      ) : null}
    </div>
  );
}

function MissionStack({
  missions,
  onOpen,
}: {
  missions: Mission[];
  onOpen: (mission: Mission) => void;
}) {
  return (
    <div className="space-y-0 pb-36 pt-2">
      {missions.map((mission, index) => (
        <MissionStackCard key={mission.missionId} mission={mission} index={index} onOpen={onOpen} />
      ))}
    </div>
  );
}

function MissionStackCard({
  mission,
  index,
  onOpen,
}: {
  mission: Mission;
  index: number;
  onOpen: (mission: Mission) => void;
}) {
  const interactive = ["ACTIVE", "SUCCESS", "FAILURE"].includes(mission.status);
  const categoryMeta = getMissionCategoryMeta(mission.category);
  const statusMeta = getMissionStatusMeta(mission.status);
  const rotation = index % 2 === 0 ? "-rotate-[4deg]" : "rotate-[5deg]";
  const offset = index === 0 ? "" : "-mt-2";

  const content = (
    <Card
      className={cn(
        "relative rounded-[20px] border-gray-200 bg-white p-4 shadow-card transition-all duration-200 ease-out",
        rotation,
        interactive &&
          "group-hover:-translate-y-1 group-hover:shadow-lg group-focus-visible:-translate-y-1 group-focus-visible:shadow-lg",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${categoryMeta.className}`}>
          {categoryMeta.label}
        </span>
        <span className={`rounded-full border bg-white px-4 py-2 text-sm font-semibold ${statusMeta.className}`}>
          {statusMeta.label}
        </span>
      </div>
      <h2 className="mt-4 text-2xl font-bold leading-8 text-black-700">{mission.title}</h2>
      <p className="mt-6 text-sm leading-6 text-black-950">{mission.description}</p>
    </Card>
  );

  return (
    <div className={`mx-auto w-[84%] max-w-[320px] ${offset}`}>
      {interactive ? (
        <button
          className="group block w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
          type="button"
          onClick={() => onOpen(mission)}
        >
          {content}
        </button>
      ) : (
        content
      )}
    </div>
  );
}

function MissionListDialog({
  mission,
  onClose,
  onGoCollections,
}: {
  mission: Mission;
  onClose: () => void;
  onGoCollections: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] mx-auto flex w-full max-w-[430px] items-center justify-center bg-black/35 px-5 py-6">
      <Card className="max-h-[calc(100dvh-48px)] w-full max-w-[390px] overflow-y-auto rounded-[28px] border-gray-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-primary">채집한 미션</p>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-2xl text-black-700"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            <img className="h-4 w-4" src={closeIcon} alt="" aria-hidden="true" />
          </button>
        </div>
        <CompletedMissionNotice mission={mission} onGoCollections={onGoCollections} />
      </Card>
    </div>
  );
}

function MissionDialogCard({ mission }: { mission: Mission }) {
  const categoryMeta = getMissionCategoryMeta(mission.category);

  return (
    <div className="mt-5 rounded-[22px] border border-gray-200 bg-[#FFFFF7] p-4">
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${categoryMeta.className}`}>
        {categoryMeta.label}
      </span>
      <h2 className="mt-3 text-lg font-bold leading-7 text-black-950">{mission.title}</h2>
      <p className="mt-3 text-sm leading-6 text-black-700">{mission.description}</p>
    </div>
  );
}

function CompletedMissionNotice({ mission, onGoCollections }: { mission: Mission; onGoCollections: () => void }) {
  return (
    <div className="mt-5">
      <MissionDialogCard mission={mission} />
      <p className="mt-4 text-sm leading-6 text-gray-600">
        이미 채집된 미션입니다. 채집 기록에서 확인해주세요.
      </p>
      <Button className="mt-5 w-full" type="button" onClick={onGoCollections}>
        채집 기록으로 이동
      </Button>
    </div>
  );
}
