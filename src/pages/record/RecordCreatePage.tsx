import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router";

import RecordForm from "@/features/record/components/RecordForm";
import { useRecordDraftStore } from "@/features/record/stores/recordDraftStore";
import type { RecordDraft, RecordResultStatus } from "@/features/record/types/record";
import PageHeader from "@/shared/ui/PageHeader";

type RecordRouteState = {
  tripId?: number;
  missionId?: number;
  status?: RecordResultStatus;
};

function isRecordStatus(value: string | null): value is RecordResultStatus {
  return value === "SUCCESS" || value === "FAILURE";
}

export default function RecordCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const setDraft = useRecordDraftStore((state) => state.setDraft);
  const routeState = (location.state ?? {}) as RecordRouteState;
  const tripId = routeState.tripId ?? Number(searchParams.get("tripId"));
  const missionId = routeState.missionId ?? Number(searchParams.get("missionId"));
  const statusParam = routeState.status ?? searchParams.get("status");
  const status = isRecordStatus(statusParam) ? statusParam : null;

  function handleSubmit(draft: RecordDraft) {
    setDraft(draft);
    navigate("/photo-piece");
  }

  if (!tripId || !missionId || !status) {
    return <Navigate to="/missions" replace />;
  }

  return (
    <>
      <PageHeader
        title="기록 작성"
        description={status === "SUCCESS" ? "채집한 장면을 사진과 한줄평으로 남깁니다." : "실패한 미션도 흐릿한 표본으로 보관합니다."}
      />
      <RecordForm tripId={tripId} missionId={missionId} status={status} onSubmit={handleSubmit} />
    </>
  );
}
