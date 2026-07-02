import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import ShapeSelector from "@/features/collection/components/ShapeSelector";
import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { saveLocalImage } from "@/features/collection/lib/localImageStorage";
import { useCreateCollectionMutation } from "@/features/collection/queries/useCreateCollectionMutation";
import type { CollectionStatus, CropType } from "@/features/collection/types/collection";
import type { RecordResultStatus } from "@/features/record/types/record";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";

type RecordRouteState = {
  tripId?: number;
  missionId?: number;
  status?: RecordResultStatus;
};

type RecordFlowStep = "capture" | "memo" | "complete";

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
          cropType: "BUTTERFLY",
          memo: "",
        }
      : null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const fileInputId = "record-image-input";

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function updateFlow(patch: Partial<RecordFlowState>) {
    setFlow((current) => (current ? { ...current, ...patch } : current));
    setErrorMessage(null);
  }

  function updateImageFile(imageFile: File | null) {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const objectUrl = imageFile ? URL.createObjectURL(imageFile) : null;
    previewUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    updateFlow({ imageFile });
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
      <div className="-mx-5 -my-6 flex min-h-dvh flex-col bg-[#FFFFF7] px-5 py-8 text-center">
        <h1 className="mt-8 text-3xl font-bold text-black-950">채집 완료!</h1>
        <p className="mt-3 text-sm leading-6 text-black-700">청춘 조각이 도감에 담겼어요</p>
        <div
          className="mt-14 flex h-56 items-center justify-center rounded-[32px] border border-dashed border-primary/30 bg-white text-sm font-semibold text-primary shadow-card"
          style={{
            backgroundImage: "url('/images/record/complete-book.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <span className="rounded-full bg-white/85 px-4 py-2">완성된 도감</span>
        </div>
        <div className="mt-auto grid gap-2 pb-3">
          <Link to="/missions">
            <Button className="w-full" size="lg">
              미션 더 뽑기
            </Button>
          </Link>
          <Link to="/home">
            <Button className="w-full" variant="greenOutline" size="lg">
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="-mx-5 -my-6 min-h-dvh bg-[#FFFFF7] px-5 py-6">
      {step === "capture" ? (
        <section className="flex min-h-[calc(100dvh-48px)] flex-col">
          <p className="text-sm font-semibold text-primary">{flow.status === "SUCCESS" ? "성공한 순간" : "실패한 순간"}</p>
          <h1 className="mt-3 text-3xl font-bold text-black-950">청춘 조각 만들기</h1>
          <p className="mt-3 text-sm leading-6 text-black-700">사진을 골라 청춘 조각으로 만들어보세요</p>

          <label
            className="mt-8 flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-[32px] border border-dashed border-primary/40 bg-white p-4 text-center shadow-card"
            htmlFor={fileInputId}
          >
            {previewUrl ? (
              <img className="max-h-64 w-full rounded-[24px] object-cover" src={previewUrl} alt="선택한 사진 미리보기" />
            ) : (
              <>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-3xl text-primary" aria-hidden="true">
                  📷
                </span>
                <span className="mt-4 text-base font-bold text-black-950">사진 추가하기</span>
              </>
            )}
          </label>
          <input
            id={fileInputId}
            className="sr-only"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(event) => updateImageFile(event.target.files?.[0] ?? null)}
          />

          <Card className="mt-auto rounded-[28px] border-gray-200">
            <p className="text-base font-bold text-black-950">어떤 모양으로 채집할까요?</p>
            <p className="mt-2 text-xs leading-5 text-gray-600">달팽이 느낌의 선택지는 잠자리 조각으로 저장돼요.</p>
            <div className="mt-4">
              <ShapeSelector value={flow.cropType} onChange={(cropType) => updateFlow({ cropType })} />
            </div>
            <Button className="mt-5 w-full" size="lg" disabled={!flow.imageFile || !flow.cropType} onClick={() => setStep("memo")}>
              채집하기
            </Button>
          </Card>
        </section>
      ) : null}

      {step === "memo" ? (
        <section className="flex min-h-[calc(100dvh-48px)] flex-col">
          <h1 className="mt-4 text-3xl font-bold text-black-950">한줄평 남기기</h1>
          <p className="mt-3 text-sm leading-6 text-black-700">이 순간을 한 줄로 남겨주세요</p>
          <div className="mt-8">
            <SpecimenImage imageUrl={previewUrl} cropType={flow.cropType ?? "BUTTERFLY"} status={flow.status} />
          </div>
          <textarea
            className="mt-6 min-h-32 w-full rounded-[24px] border border-gray-200 bg-white p-4 text-base text-black-950 shadow-card outline-none placeholder:text-gray-400 focus:border-primary"
            value={flow.memo}
            onChange={(event) => updateFlow({ memo: event.target.value })}
            placeholder="이 순간을 한 줄로 남겨주세요"
          />
          {errorMessage ? <p className="mt-4 text-sm text-danger">{errorMessage}</p> : null}
          <div className="mt-auto grid grid-cols-2 gap-2 pb-3">
            <Button type="button" variant="grayOutline" onClick={() => setStep("capture")}>
              이전
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={createCollectionMutation.isPending || !flow.imageFile || !flow.cropType}>
              조각 채집하기
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
