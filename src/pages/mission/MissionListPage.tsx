import { useCallback, useEffect, useRef, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { getCollection } from "@/features/collection/api/collectionApi";
import { getLocalImage } from "@/features/collection/lib/localImageStorage";
import { collectionKeys } from "@/features/collection/queries/collectionKeys";
import { useCollectionsQuery } from "@/features/collection/queries/useCollectionsQuery";
import type { CollectionDetail } from "@/features/collection/types/collection";
import MissionDrawLoading from "@/features/mission/components/MissionDrawLoading";
import MissionDrawResult from "@/features/mission/components/MissionDrawResult";
import MissionTabs, { type MissionTab } from "@/features/mission/components/MissionTabs";
import { useMissionListQuery } from "@/features/mission/queries/useMissionListQuery";
import { useRandomMissionMutation } from "@/features/mission/queries/useRandomMissionMutation";
import { useStartMissionMutation } from "@/features/mission/queries/useStartMissionMutation";
import type { Mission, MissionStatus } from "@/features/mission/types/mission";
import { useCurrentTripQuery } from "@/features/trip/queries/useCurrentTripQuery";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";
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
  const [drawMode, setDrawMode] = useState(searchParams.get("draw") === "1");
  const autoDrawStartedRef = useRef(false);
  const [pickedMission, setPickedMission] = useState<Mission | null>(null);
  const [drawErrorMessage, setDrawErrorMessage] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"SUCCESS" | "FAILURE" | null>(null);
  const currentTripQuery = useCurrentTripQuery(userId);
  const trip = currentTripQuery.data?.hasActiveTrip ? currentTripQuery.data.trip : null;
  const status = toMissionStatus(tab);
  const missionListQuery = useMissionListQuery(userId, trip?.tripId, status);
  const randomMissionMutation = useRandomMissionMutation(userId, trip?.tripId);
  const startMissionMutation = useStartMissionMutation(userId, trip?.tripId);
  const missions = missionListQuery.data ?? [];

  const handleGenerate = useCallback(async () => {
    setDrawMode(true);
    setSearchParams({ draw: "1" }, { replace: true });
    setPickedMission(null);
    setDrawErrorMessage(null);
    try {
      const mission = await randomMissionMutation.mutateAsync();
      setPickedMission(mission);
    } catch (error) {
      setDrawErrorMessage(error instanceof Error ? error.message : "미션을 뽑지 못했습니다.");
    }
  }, [randomMissionMutation, setSearchParams]);

  useEffect(() => {
    if (!trip || !drawMode || searchParams.get("draw") !== "1" || autoDrawStartedRef.current) return;
    autoDrawStartedRef.current = true;
    randomMissionMutation.mutate(undefined, {
      onSuccess: (mission) => setPickedMission(mission),
      onError: (error) => {
        setDrawErrorMessage(error instanceof Error ? error.message : "미션을 뽑지 못했습니다.");
      },
    });
  }, [drawMode, randomMissionMutation, searchParams, trip]);

  async function handleStart(mission: Mission) {
    await startMissionMutation.mutateAsync(mission.missionId);
    navigate("/home", { replace: true });
  }

  function closeMissionDialog() {
    setSelectedMission(null);
    setSelectedStatus(null);
  }

  function closeDrawMode() {
    setDrawMode(false);
    setPickedMission(null);
    setDrawErrorMessage(null);
    setSearchParams({}, { replace: true });
  }

  function moveToRecord(status: "SUCCESS" | "FAILURE") {
    if (!selectedMission) return;
    navigate(`/records/new?tripId=${selectedMission.tripId}&missionId=${selectedMission.missionId}&status=${status}`, {
      state: { tripId: selectedMission.tripId, missionId: selectedMission.missionId, status },
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
    <div className="-mx-5 -my-6 min-h-dvh bg-[#FFFFF7] px-5 py-6">
      {drawMode ? (
        <div>
          <button className="mb-5 text-sm font-semibold text-primary" type="button" onClick={closeDrawMode}>
            ← 미션 목록
          </button>
          {drawErrorMessage ? (
            <div className="rounded-[28px] border border-gray-200 bg-white p-5 text-center shadow-card">
              <p className="text-base font-bold text-black-950">미션을 뽑지 못했어요</p>
              <p className="mt-3 text-sm leading-6 text-danger">{drawErrorMessage}</p>
              <Button className="mt-6 w-full" onClick={handleGenerate}>
                다시 뽑기
              </Button>
            </div>
          ) : randomMissionMutation.isPending || !pickedMission ? (
            <MissionDrawLoading />
          ) : (
            <MissionDrawResult
              mission={pickedMission}
              onRetry={handleGenerate}
              onStart={() => handleStart(pickedMission)}
              retryDisabled={randomMissionMutation.isPending}
              startDisabled={startMissionMutation.isPending}
            />
          )}
        </div>
      ) : (
        <>
      <PageHeader
        title="미션"
        description={trip.tripName}
        action={
          null
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
          <MissionStack missions={missions} onStart={handleStart} onOpen={setSelectedMission} />
        ) : (
          <EmptyState title="미션이 없습니다" description="랜덤 미션을 뽑아 첫 채집을 시작하세요." />
        )}
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-16 z-40 mx-auto w-full max-w-[430px] px-5 pb-4">
        <Button
          className="pointer-events-auto w-full border-2 border-primary bg-white text-primary hover:bg-primary-soft"
          size="lg"
          onClick={handleGenerate}
          disabled={randomMissionMutation.isPending}
        >
          랜덤 미션 뽑기
        </Button>
      </div>
        </>
      )}
      {selectedMission ? (
        <MissionListDialog
          mission={selectedMission}
          userId={userId}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          onClose={closeMissionDialog}
          onBack={() => setSelectedStatus(null)}
          onRecord={() => selectedStatus && moveToRecord(selectedStatus)}
        />
      ) : null}
    </div>
  );
}

function MissionStack({
  missions,
  onStart,
  onOpen,
}: {
  missions: Mission[];
  onStart: (mission: Mission) => void;
  onOpen: (mission: Mission) => void;
}) {
  return (
    <div className="space-y-0 pb-36 pt-2">
      {missions.map((mission, index) => (
        <MissionStackCard
          key={mission.missionId}
          mission={mission}
          index={index}
          onStart={onStart}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

function MissionStackCard({
  mission,
  index,
  onStart,
  onOpen,
}: {
  mission: Mission;
  index: number;
  onStart: (mission: Mission) => void;
  onOpen: (mission: Mission) => void;
}) {
  const interactive = mission.status === "ACTIVE" || mission.status === "SUCCESS" || mission.status === "FAILURE";
  const rotation = index % 2 === 0 ? "-rotate-[4deg]" : "rotate-[5deg]";
  const offset = index === 0 ? "" : "-mt-8";

  const content = (
    <Card className={`relative rounded-[22px] border-gray-200 bg-white p-5 shadow-card ${rotation}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
          {mission.isLocal ? "지역" : "즉흥"}
        </span>
        <span className="rounded-full border border-gray-400 bg-white px-4 py-2 text-sm font-semibold text-gray-500">
          {mission.status === "ACTIVE"
            ? "진행 중"
            : mission.status === "SUCCESS"
              ? "성공"
              : mission.status === "FAILURE"
                ? "실패"
                : "추천"}
        </span>
      </div>
      <h2 className="mt-6 text-3xl font-bold leading-10 text-black-700">{mission.title}</h2>
      <p className="mt-8 text-base leading-7 text-black-950">{mission.description}</p>
      {mission.status === "RECOMMENDED" ? (
        <Button className="mt-5 w-full" onClick={() => onStart(mission)}>
          미션 시작
        </Button>
      ) : null}
    </Card>
  );

  return (
    <div className={`mx-auto w-[88%] max-w-[340px] ${offset}`}>
      {interactive ? (
        <button className="block w-full text-left" type="button" onClick={() => onOpen(mission)}>
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
  userId,
  selectedStatus,
  onSelectStatus,
  onClose,
  onBack,
  onRecord,
}: {
  mission: Mission;
  userId?: number;
  selectedStatus: "SUCCESS" | "FAILURE" | null;
  onSelectStatus: (status: "SUCCESS" | "FAILURE") => void;
  onClose: () => void;
  onBack: () => void;
  onRecord: () => void;
}) {
  const isCompleted = mission.status === "SUCCESS" || mission.status === "FAILURE";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] mx-auto flex w-full max-w-[430px] items-end justify-center bg-black/10 px-5 pb-24 pt-6">
      <Card className="max-h-[72dvh] w-full max-w-[360px] overflow-y-auto rounded-[28px] border-gray-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-primary">{isCompleted ? "채집한 미션" : "진행중인 미션"}</p>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-2xl text-black-700"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {isCompleted ? (
          <CompletedMissionContent mission={mission} userId={userId} />
        ) : !selectedStatus ? (
          <>
            <MissionDialogCard mission={mission} />
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button type="button" variant="grayOutline" onClick={() => onSelectStatus("FAILURE")}>
                실패
              </Button>
              <Button type="button" onClick={() => onSelectStatus("SUCCESS")}>
                성공
              </Button>
            </div>
          </>
        ) : (
          <ResultConfirm status={selectedStatus} onBack={onBack} onClose={onClose} onRecord={onRecord} />
        )}
      </Card>
    </div>
  );
}

function MissionDialogCard({ mission }: { mission: Mission }) {
  return (
    <div className="mt-5 rounded-[22px] border border-gray-200 bg-[#FFFFF7] p-4">
      <span className="inline-flex rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">즉흥</span>
      <h2 className="mt-3 text-lg font-bold leading-7 text-black-950">{mission.title}</h2>
      <p className="mt-3 text-sm leading-6 text-black-700">{mission.description}</p>
    </div>
  );
}

function ResultConfirm({
  status,
  onBack,
  onClose,
  onRecord,
}: {
  status: "SUCCESS" | "FAILURE";
  onBack: () => void;
  onClose: () => void;
  onRecord: () => void;
}) {
  const isSuccess = status === "SUCCESS";

  return (
    <div className="mt-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-2xl text-primary">
        {isSuccess ? "✓" : "!"}
      </div>
      <h2 className="mt-4 text-xl font-bold text-black-950">{isSuccess ? "고생했어요!" : "미션에 실패하셨나요?"}</h2>
      <p className="mt-3 text-sm leading-6 text-black-700">
        {isSuccess
          ? "미션을 성공적으로 완료했어요. 성공의 순간을 사진으로 채집해 볼까요?"
          : "미션에 실패해도 추억은 저장할 수 있어요. 실패한 추억을 채집해볼까요?"}
      </p>
      <div className="mt-6 grid gap-2">
        <Button type="button" onClick={onRecord}>
          사진 채집하기
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="grayOutline" onClick={onBack}>
            다시 선택
          </Button>
          <Button type="button" variant="grayOutline" onClick={onClose}>
            나가기
          </Button>
        </div>
      </div>
    </div>
  );
}

function CompletedMissionContent({ mission, userId }: { mission: Mission; userId?: number }) {
  const collectionListQuery = useCollectionsQuery(userId, mission.tripId, mission.status === "SUCCESS" ? "SUCCESS" : "FAILURE");
  const collectionDetails = useQueries({
    queries: (collectionListQuery.data ?? []).map((collection) => ({
      queryKey: collectionKeys.detail(collection.collectionId),
      queryFn: () => getCollection(userId as number, collection.collectionId),
      enabled: userId !== undefined,
    })),
  });
  const collection = collectionDetails.find((query) => query.data?.missionId === mission.missionId)?.data ?? null;

  if (collectionListQuery.isLoading || collectionDetails.some((query) => query.isLoading)) {
    return <p className="mt-6 text-sm text-gray-600">채집 기록을 불러오는 중...</p>;
  }

  return collection ? (
    <CompletedCollectionView collection={collection} mission={mission} />
  ) : (
    <>
      <MissionDialogCard mission={mission} />
      <p className="mt-4 text-sm leading-6 text-gray-600">
        이 미션의 채집 기록을 찾지 못했어요. 기록 목록에서 다시 확인해주세요.
      </p>
    </>
  );
}

function CompletedCollectionView({ collection, mission }: { collection: CollectionDetail; mission: Mission }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadImage() {
      if (!collection.imageId) return;
      const localImage = await getLocalImage(collection.imageId);
      if (!localImage || cancelled) return;
      objectUrl = URL.createObjectURL(localImage.blob);
      setImageUrl(objectUrl);
    }

    void loadImage();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [collection.imageId]);

  return (
    <div className="mt-5">
      <SpecimenImage imageUrl={imageUrl} cropType={collection.cropType} status={collection.status} alt={mission.title} />
      <div className="mt-4 rounded-[22px] border border-gray-200 bg-[#FFFFF7] p-4">
        <span className="inline-flex rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
          {collection.status === "SUCCESS" ? "성공" : "실패"}
        </span>
        <h2 className="mt-3 text-lg font-bold leading-7 text-black-950">{mission.title}</h2>
        <p className="mt-3 text-sm leading-6 text-black-700">
          {collection.memo || "남겨진 한줄평이 없어요."}
        </p>
      </div>
    </div>
  );
}
