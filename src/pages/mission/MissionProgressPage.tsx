import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import closeIcon from "@/assets/icons/close.svg";
import okayIcon from "@/assets/icons/okay.svg";
import warningIcon from "@/assets/icons/warning.svg";
import { useAuthStore } from "@/features/auth/stores/authStore";
import MissionStatusBadge from "@/features/mission/components/MissionStatusBadge";
import { useMissionDetailQuery } from "@/features/mission/queries/useMissionDetailQuery";
import type { RecordResultStatus } from "@/features/record/types/record";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";

export default function MissionProgressPage() {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const user = useAuthStore((state) => state.currentUser);
  const numericMissionId = missionId ? Number(missionId) : undefined;
  const missionQuery = useMissionDetailQuery(user?.userId, numericMissionId);
  const mission = missionQuery.data;
  const [selectedStatus, setSelectedStatus] = useState<RecordResultStatus | null>(null);

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
    <div className="-mx-5 -my-6 flex min-h-dvh items-end bg-[#FFFFF7] px-5 py-6 sm:items-center">
      <Card className="w-full rounded-[32px] border-gray-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-primary">진행중인 미션</p>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-xl text-black-700"
            type="button"
            aria-label="닫기"
            onClick={() => navigate(-1)}
          >
            <img className="h-4 w-4" src={closeIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        {!selectedStatus ? (
          <>
            <div className="mt-6 rounded-[24px] border border-gray-200 bg-[#FFFFF7] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold leading-7 text-black-950">{mission.title}</h1>
                  <p className="mt-3 text-sm leading-6 text-black-700">{mission.description}</p>
                </div>
                <MissionStatusBadge status={mission.status} />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button type="button" variant="grayOutline" onClick={() => setSelectedStatus("FAILURE")}>
                실패
              </Button>
              <Button type="button" onClick={() => setSelectedStatus("SUCCESS")}>
                성공
              </Button>
            </div>
          </>
        ) : (
          <ResultConfirm
            status={selectedStatus}
            onCancel={() => navigate(-1)}
            onBack={() => setSelectedStatus(null)}
            onRecord={() => moveToRecord(selectedStatus)}
          />
        )}
      </Card>
    </div>
  );
}

function ResultConfirm({
  status,
  onCancel,
  onBack,
  onRecord,
}: {
  status: RecordResultStatus;
  onCancel: () => void;
  onBack: () => void;
  onRecord: () => void;
}) {
  const isSuccess = status === "SUCCESS";

  return (
    <div className="mt-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-3xl text-primary">
        <img className="h-7 w-7" src={isSuccess ? okayIcon : warningIcon} alt="" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-2xl font-bold text-black-950">{isSuccess ? "고생했어요!" : "미션에 실패하셨나요?"}</h2>
      <p className="mt-4 text-sm leading-6 text-black-700">
        {isSuccess
          ? "미션을 성공적으로 완료했어요. 성공의 순간을 사진으로 채집해 볼까요?"
          : "미션에 실패해도 추억은 저장할 수 있어요. 실패한 추억을 채집해볼까요?"}
      </p>
      <div className="mt-8 grid gap-2">
        <Button type="button" onClick={onRecord}>
          사진 채집하기
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="grayOutline" onClick={onBack}>
            다시 선택
          </Button>
          <Button type="button" variant="grayOutline" onClick={onCancel}>
            나가기
          </Button>
        </div>
      </div>
    </div>
  );
}
