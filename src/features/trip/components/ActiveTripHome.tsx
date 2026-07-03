import { useState } from "react";
import { Link, useNavigate } from "react-router";

import cameraIcon from "@/assets/icons/camera.svg";
import { useAuthStore } from "@/features/auth/stores/authStore";
import CollectionPreviewDialog from "@/features/collection/components/CollectionPreviewDialog";
import SpecimenLayer from "@/features/collection/components/SpecimenLayer";
import { useCollectionDetailQuery } from "@/features/collection/queries/useCollectionDetailQuery";
import { useCollectionsQuery } from "@/features/collection/queries/useCollectionsQuery";
import type { CollectionListItem } from "@/features/collection/types/collection";
import MissionActionDialog from "@/features/mission/components/MissionActionDialog";
import { useMissionListQuery } from "@/features/mission/queries/useMissionListQuery";
import type { Mission } from "@/features/mission/types/mission";
import type { RecordResultStatus } from "@/features/record/types/record";
import TripEndConfirmDialog from "@/features/trip/components/TripEndConfirmDialog";
import TripInfoDialog from "@/features/trip/components/TripInfoDialog";
import { useEndTripMutation } from "@/features/trip/queries/useEndTripMutation";
import type { Trip } from "@/features/trip/types/trip";
import Button from "@/shared/ui/Button";

type ActiveTripHomeProps = {
  trip: Trip;
  userId?: number;
};

export default function ActiveTripHome({ trip, userId }: ActiveTripHomeProps) {
  const navigate = useNavigate();
  const nickname = useAuthStore((state) => state.currentUser?.nickname ?? "채집가");
  const activeMissionQuery = useMissionListQuery(userId, trip.tripId, "ACTIVE");
  const collectionsQuery = useCollectionsQuery(userId, trip.tripId);
  const endTripMutation = useEndTripMutation(userId);
  const activeMissions = activeMissionQuery.data ?? [];
  const collections = collectionsQuery.data ?? [];
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<RecordResultStatus | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [isTripInfoOpen, setIsTripInfoOpen] = useState(false);
  const [isTripEndConfirmOpen, setIsTripEndConfirmOpen] = useState(false);
  const selectedCollectionQuery = useCollectionDetailQuery(userId, selectedCollectionId ?? undefined);

  function closeMissionDialog() {
    setSelectedMission(null);
    setSelectedStatus(null);
  }

  function moveToRecord(status: RecordResultStatus) {
    if (!selectedMission) return;
    navigate(`/records/new?tripId=${selectedMission.tripId}&missionId=${selectedMission.missionId}&status=${status}`, {
      state: {
        tripId: selectedMission.tripId,
        missionId: selectedMission.missionId,
        status,
      },
    });
  }

  async function confirmEndTrip() {
    await endTripMutation.mutateAsync(trip.tripId);
    navigate(`/trips/${trip.tripId}/review`, { replace: true });
  }

  const tripDayLabel = getTripDayLabel(trip.startDate, `${trip.startDate} - ${trip.endDate}`);

  return (
    <div className="flex min-h-[calc(100dvh-64px)] flex-col gap-3 overflow-hidden bg-[#FFFFF7] px-5 py-6">
      <header className="flex items-start justify-between gap-4 pt-6">
        <button className="min-w-0 text-left" type="button" onClick={() => setIsTripInfoOpen(true)}>
          <p className="text-xs font-medium leading-4 text-black-950">
            <span className="font-bold">{nickname}님</span>의 청춘도감
          </p>
          <h1 className="mt-1 truncate text-2xl font-normal leading-9 text-black-950">{trip.tripName}</h1>
          <p className="text-xs leading-5 text-black-700">
            {trip.region} · {tripDayLabel}
          </p>
        </button>

        <div className="mt-2 flex shrink-0 items-center rounded-[10px] px-2 py-1">
          <StatCount label="완료" value={trip.missionSummary.successCount} valueClassName="text-primary" />
          <div className="mx-3 h-8 w-px bg-[#F4D8B6]" aria-hidden="true" />
          <StatCount label="실패" value={trip.missionSummary.failedCount} valueClassName="text-off" />
        </div>
      </header>

      <section className="relative flex h-[230px] shrink-0 items-center justify-center" aria-label="청춘도감">
        <OpenBookImage collections={collections} onSelectCollection={setSelectedCollectionId} />
      </section>

      <section className="flex min-h-0 flex-1 flex-col">
        <p className="mb-2 text-xs leading-5 text-black-700">진행 중인 미션</p>
        <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-[#F1F1EF] px-3 py-3">
          <div className="flex-1 space-y-2 overflow-hidden">
            {activeMissionQuery.isLoading ? (
              <p className="flex h-full items-center justify-center text-sm text-gray-600">미션을 불러오는 중...</p>
            ) : activeMissions.length > 0 ? (
              activeMissions.slice(0, 4).map((mission) => (
                <button
                  key={mission.missionId}
                  type="button"
                  className="flex min-h-12 w-full items-center justify-between gap-3 rounded-[10px] bg-white px-3 py-3 text-left text-base font-medium leading-5 text-black-950 shadow-[0_4px_4px_rgba(0,0,0,0.15)]"
                  onClick={() => setSelectedMission(mission)}
                >
                  <span className="line-clamp-2">{mission.title}</span>
                  <img className="h-6 w-6 shrink-0 opacity-70" src={cameraIcon} alt="" aria-hidden="true" />
                </button>
              ))
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/70 text-sm text-off">
                시작한 미션이 없어요
              </div>
            )}
          </div>

          <Link className="mt-3 block" to="/missions?draw=1">
            <Button className="w-full bg-white text-base font-medium" variant="greenOutline" size="md">
              랜덤 미션 뽑기
            </Button>
          </Link>
        </div>
      </section>

      {selectedMission ? (
        <MissionActionDialog
          mission={selectedMission}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          onClose={closeMissionDialog}
          onBack={() => setSelectedStatus(null)}
          onRecord={() => selectedStatus && moveToRecord(selectedStatus)}
        />
      ) : null}
      <TripInfoDialog
        trip={trip}
        open={isTripInfoOpen}
        onClose={() => setIsTripInfoOpen(false)}
        onRequestEnd={() => {
          setIsTripInfoOpen(false);
          setIsTripEndConfirmOpen(true);
        }}
      />
      <TripEndConfirmDialog
        open={isTripEndConfirmOpen}
        isPending={endTripMutation.isPending}
        onClose={() => setIsTripEndConfirmOpen(false)}
        onConfirm={confirmEndTrip}
      />
      {selectedCollectionId ? (
        <CollectionPreviewDialog
          collection={selectedCollectionQuery.data ?? null}
          isLoading={selectedCollectionQuery.isLoading}
          onClose={() => setSelectedCollectionId(null)}
        />
      ) : null}
    </div>
  );
}

function StatCount({ label, value, valueClassName }: { label: string; value: number; valueClassName: string }) {
  return (
    <div className="min-w-7 text-center">
      <p className={`text-xl font-bold leading-5 ${valueClassName}`}>{value}</p>
      <p className="mt-1 text-xs leading-5 text-black-700">{label}</p>
    </div>
  );
}

function OpenBookImage({
  collections,
  onSelectCollection,
}: {
  collections: CollectionListItem[];
  onSelectCollection: (collectionId: number) => void;
}) {
  return (
    <div className="relative flex h-full w-full max-w-[340px] items-center justify-center px-8">
      <img
        className="h-full w-full object-contain"
        src="/images/home/open-book.png"
        alt="펼쳐진 청춘도감"
      />
      {collections.length > 0 ? (
        <div className="absolute inset-x-8 inset-y-0">
          <SpecimenLayer collections={collections} onSelectCollection={onSelectCollection} limit={6} />
        </div>
      ) : null}
    </div>
  );
}

function getTripDayLabel(startDate: string, fallback: string) {
  const start = parseDateOnly(startDate);
  if (!start) return fallback;

  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.floor((todayDate.getTime() - start.getTime()) / 86_400_000) + 1;

  if (!Number.isFinite(diffDays)) return fallback;
  return `${Math.max(diffDays, 1)}일차`;
}

function parseDateOnly(value: string) {
  const [year, month, date] = value.split("-").map(Number);
  if (!year || !month || !date) return null;

  const parsed = new Date(year, month - 1, date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}
