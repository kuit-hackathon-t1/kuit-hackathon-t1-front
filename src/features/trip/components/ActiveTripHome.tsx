import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import { useMissionListQuery } from "@/features/mission/queries/useMissionListQuery";
import type { Mission } from "@/features/mission/types/mission";
import type { RecordResultStatus } from "@/features/record/types/record";
import type { Trip } from "@/features/trip/types/trip";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";

type ActiveTripHomeProps = {
  trip: Trip;
  userId?: number;
};

export default function ActiveTripHome({ trip, userId }: ActiveTripHomeProps) {
  const navigate = useNavigate();
  const nickname = useAuthStore((state) => state.currentUser?.nickname ?? "채집가");
  const activeMissionQuery = useMissionListQuery(userId, trip.tripId, "ACTIVE");
  const activeMissions = activeMissionQuery.data ?? [];
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<RecordResultStatus | null>(null);

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

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <p className="text-sm text-gray-600">진행 중인 여행</p>
        <h1 className="mt-1 text-2xl font-bold text-black-950">{nickname}님의 청춘도감</h1>
      </header>

      <section className="rounded-[32px] border border-primary/20 bg-[#FFFFF7] p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-black-950">{trip.tripName}</h2>
            <p className="mt-2 text-sm text-black-700">{trip.region}</p>
            <p className="mt-1 text-xs text-gray-600">
              {trip.startDate} - {trip.endDate}
            </p>
          </div>
          <div className="rounded-2xl bg-primary-soft px-3 py-2 text-right text-xs font-semibold text-primary">
            <p>성공 {trip.missionSummary.successCount}</p>
            <p className="mt-1">실패 {trip.missionSummary.failedCount}</p>
          </div>
        </div>
        <div
          className="mt-6 flex h-40 items-center justify-center rounded-[28px] border border-dashed border-primary/30 bg-white text-sm font-semibold text-primary"
          style={{
            backgroundImage: "url('/images/home/open-book.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <span className="rounded-full bg-white/85 px-4 py-2">펼쳐진 도감</span>
        </div>
      </section>

      <Card className="rounded-[28px] border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-black-950">진행 중인 미션</p>
          <span className="text-xs text-gray-600">{activeMissions.length}개</span>
        </div>
        <div className="mt-4 space-y-3">
          {activeMissionQuery.isLoading ? (
            <p className="text-sm text-gray-600">미션을 불러오는 중...</p>
          ) : activeMissions.length > 0 ? (
            activeMissions.slice(0, 4).map((mission) => (
              <button
                key={mission.missionId}
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-black-700"
                onClick={() => setSelectedMission(mission)}
              >
                <span className="line-clamp-2 font-medium">{mission.title}</span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-card" aria-hidden="true">
                  📷
                </span>
              </button>
            ))
          ) : (
            <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-sm text-off">
              시작한 미션이 없어요
            </div>
          )}
        </div>
      </Card>

      <Link to="/missions?draw=1">
        <Button className="w-full" size="lg">
          랜덤 미션 뽑기
        </Button>
      </Link>

      {selectedMission ? (
        <MissionHomeDialog
          mission={selectedMission}
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

function MissionHomeDialog({
  mission,
  selectedStatus,
  onSelectStatus,
  onClose,
  onBack,
  onRecord,
}: {
  mission: Mission;
  selectedStatus: RecordResultStatus | null;
  onSelectStatus: (status: RecordResultStatus) => void;
  onClose: () => void;
  onBack: () => void;
  onRecord: () => void;
}) {
  const isSuccess = selectedStatus === "SUCCESS";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] mx-auto flex w-full max-w-[430px] items-end justify-center bg-black/10 px-5 pb-24 pt-6">
      <Card className="max-h-[72dvh] w-full max-w-[360px] overflow-y-auto rounded-[28px] border-gray-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-primary">진행중인 미션</p>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-2xl text-black-700"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {!selectedStatus ? (
          <>
            <div className="mt-5 rounded-[22px] border border-gray-200 bg-[#FFFFF7] p-4">
              <h2 className="text-lg font-bold leading-7 text-black-950">{mission.title}</h2>
              <p className="mt-2 text-sm leading-6 text-black-700">{mission.description}</p>
              <span className="mt-4 inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                진행중
              </span>
            </div>
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
        )}
      </Card>
    </div>
  );
}
