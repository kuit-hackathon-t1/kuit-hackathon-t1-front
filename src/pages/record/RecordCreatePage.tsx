import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router";

import ShapeSelector from "@/features/collection/components/ShapeSelector";
import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { saveLocalImage } from "@/features/collection/lib/localImageStorage";
import { useCreateCollectionMutation } from "@/features/collection/queries/useCreateCollectionMutation";
import type { CollectionStatus, CropType } from "@/features/collection/types/collection";
import { useAuthStore } from "@/features/auth/stores/authStore";
import type { RecordResultStatus } from "@/features/record/types/record";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import PageHeader from "@/shared/ui/PageHeader";

type RecordRouteState = {
  tripId?: number;
  missionId?: number;
  status?: RecordResultStatus;
};

type RecordFlowStep = "capture" | "piece" | "memo" | "complete";

type RecordFlowState = {
  tripId: number;
  missionId: number;
  status: CollectionStatus;
  imageFile: File | null;
  imageId: string | null;
  cropType: CropType | null;
  memo: string;
};

function isRecordStatus(value: string | null): value is CollectionStatus {
  return value === "SUCCESS" || value === "FAILURE";
}

export default function RecordCreatePage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((state) => state.currentUser);
  const createCollectionMutation = useCreateCollectionMutation(user?.userId);
  const routeState = (location.state ?? {}) as RecordRouteState;
  const tripId = routeState.tripId ?? Number(searchParams.get("tripId"));
  const missionId = routeState.missionId ?? Number(searchParams.get("missionId"));
  const statusParam = routeState.status ?? searchParams.get("status");
  const status = isRecordStatus(statusParam) ? statusParam : null;
  const [step, setStep] = useState<RecordFlowStep>("capture");
  const [flow, setFlow] = useState<RecordFlowState | null>(
    tripId && missionId && status
      ? {
          tripId,
          missionId,
          status,
          imageFile: null,
          imageId: null,
          cropType: null,
          memo: "",
        }
      : null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function updateImageFile(imageFile: File | null) {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const objectUrl = imageFile ? URL.createObjectURL(imageFile) : null;
    previewUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    updateFlow({ imageFile });
  }

  function updateFlow(patch: Partial<RecordFlowState>) {
    setFlow((current) => (current ? { ...current, ...patch } : current));
    setErrorMessage(null);
  }

  async function handleSubmit() {
    if (!flow?.imageFile || !flow.cropType) return;

    try {
      const imageId = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      await saveLocalImage({ id: imageId, blob: flow.imageFile, createdAt });
      await createCollectionMutation.mutateAsync({
        tripId: flow.tripId,
        missionId: flow.missionId,
        memo: flow.memo,
        imageId,
        status: flow.status,
        cropType: flow.cropType,
        emotionTags: [],
      });
      updateFlow({ imageId });
      setStep("complete");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "채집 기록을 저장하지 못했습니다.");
    }
  }

  if (!flow) {
    return <Navigate to="/missions" replace />;
  }

  if (step === "complete") {
    return (
      <>
        <PageHeader title="채집 완료" description="기록이 채집통에 저장되었습니다." />
        <Card>
          <p className="text-lg font-bold text-neutral-950">조각 채집이 완료되었습니다</p>
          <p className="mt-2 text-sm text-neutral-600">서버에서 미션 상태도 함께 반영합니다.</p>
          <div className="mt-6 grid gap-2">
            <Link to="/missions">
              <Button className="w-full">미션 더 뽑기</Button>
            </Link>
            <Link to="/home">
              <Button className="w-full" variant="secondary">
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="기록 작성"
        description={flow.status === "SUCCESS" ? "채집한 장면을 사진과 한줄평으로 남깁니다." : "실패한 미션도 흐릿한 표본으로 보관합니다."}
      />
      <Card>
        <div className="mb-4 text-sm text-neutral-500">
          {step === "capture" ? "1 / 3" : step === "piece" ? "2 / 3" : "3 / 3"}
        </div>

        {step === "capture" ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-neutral-700">
              사진
              <input
                className="mt-2 block w-full text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(event) => updateImageFile(event.target.files?.[0] ?? null)}
              />
            </label>
            {previewUrl ? <SpecimenImage imageUrl={previewUrl} cropType="BUTTERFLY" status={flow.status} /> : null}
            <Button className="w-full" disabled={!flow.imageFile} onClick={() => setStep("piece")}>
              다음
            </Button>
          </div>
        ) : null}

        {step === "piece" ? (
          <div className="space-y-4">
            {previewUrl ? <SpecimenImage imageUrl={previewUrl} cropType={flow.cropType ?? "BUTTERFLY"} status={flow.status} /> : null}
            <ShapeSelector value={flow.cropType} onChange={(cropType) => updateFlow({ cropType })} />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setStep("capture")}>
                이전
              </Button>
              <Button disabled={!flow.cropType} onClick={() => setStep("memo")}>
                다음
              </Button>
            </div>
          </div>
        ) : null}

        {step === "memo" ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-neutral-700">
              한줄평
              <textarea
                className="mt-2 min-h-28 w-full rounded-lg border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-emerald-700"
                value={flow.memo}
                onChange={(event) => updateFlow({ memo: event.target.value })}
                placeholder="이 장면을 짧게 남겨주세요."
              />
            </label>
            {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setStep("piece")}>
                이전
              </Button>
              <Button onClick={handleSubmit} disabled={createCollectionMutation.isPending || !flow.imageFile || !flow.cropType}>
                조각 채집하기
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </>
  );
}
