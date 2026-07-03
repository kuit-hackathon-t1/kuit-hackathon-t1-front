import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router";

import cameraIcon from "@/assets/icons/camera.svg";
import leftarrowIcon from "@/assets/icons/leftarrow.svg";
import { useAuthStore } from "@/features/auth/stores/authStore";
import ShapeSelector from "@/features/collection/components/ShapeSelector";
import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { saveLocalImage } from "@/features/collection/lib/localImageStorage";
import { useCreateCollectionMutation } from "@/features/collection/queries/useCreateCollectionMutation";
import type { CollectionStatus, CropType } from "@/features/collection/types/collection";
import type { RecordResultStatus } from "@/features/record/types/record";
import Button from "@/shared/ui/Button";

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
  const navigate = useNavigate();
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
          cropType: "SNAIL",
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
        <div className="mt-16">
          <div className="mx-auto text-5xl leading-none" aria-hidden="true">
            🪐
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-10 text-black-950">채집 완료!</h1>
          <p className="mt-1 text-sm leading-6 text-black-700">청춘 조각이 도감에 담겼어요</p>
        </div>

        <div className="relative mt-12 flex h-72 items-center justify-center">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-light leading-none text-off" aria-hidden="true">
            ‹
          </span>
          <div className="relative h-full w-full max-w-[360px]">
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/images/home/open-book.png')" }}
              aria-label="완성된 도감"
            />
            <div className="absolute left-1/2 top-1/2 w-20 -translate-x-1/2 -translate-y-1/2">
              <SpecimenImage
                imageUrl={previewUrl}
                cropType={flow.cropType ?? "SNAIL"}
                status={flow.status}
                className="border-0 bg-transparent"
              />
            </div>
          </div>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-4xl font-light leading-none text-off" aria-hidden="true">
            ›
          </span>
        </div>

        <div className="mt-auto grid gap-3 pb-3">
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
          <RecordHeader title="청춘 조각 만들기" onBack={() => navigate(-1)} />
          <p className="mt-7 text-xs font-semibold text-primary">{flow.status === "SUCCESS" ? "성공한 순간" : "실패한 순간"}</p>
          <p className="mt-3 text-sm leading-6 text-black-700">사진을 골라 청춘 조각으로 만들어보세요</p>

          <label
            className="mt-7 flex min-h-[45dvh] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-gray-300 bg-gray-100 p-4 text-center"
            htmlFor={fileInputId}
          >
            {previewUrl ? (
              <img className="h-full max-h-[45dvh] w-full rounded-[22px] object-cover" src={previewUrl} alt="선택한 사진 미리보기" />
            ) : (
              <>
                <span className="flex h-16 w-16 items-center justify-center text-3xl text-gray-500" aria-hidden="true">
                  <img className="h-14 w-14 opacity-60" src={cameraIcon} alt="" />
                </span>
                <span className="mt-3 text-lg font-medium text-gray-500">사진 추가하기</span>
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

          <div className="mt-auto rounded-[16px] bg-[#9D9F9C] p-3">
            <p className="text-xs font-medium text-white">어떤 모양으로 채집할까요?</p>
            <div className="mt-3">
              <ShapeSelector value={flow.cropType} onChange={(cropType) => updateFlow({ cropType })} />
            </div>
          </div>
          <Button
            className="mt-5 w-full disabled:border-transparent disabled:bg-[#9D9F9C] disabled:text-white"
            size="lg"
            disabled={!flow.imageFile || !flow.cropType}
            onClick={() => setStep("memo")}
          >
            채집하기
          </Button>
        </section>
      ) : null}

      {step === "memo" ? (
        <section className="flex min-h-[calc(100dvh-48px)] flex-col">
          <RecordHeader title="한줄평 남기기" onBack={() => setStep("capture")} />
          <div className="mt-[41px] flex min-h-[360px] items-center justify-center rounded-[28px] border border-gray-200 bg-gray-100 p-6">
            <SpecimenImage
              imageUrl={previewUrl}
              cropType={flow.cropType ?? "SNAIL"}
              status={flow.status}
              className="w-64 border-0 bg-transparent"
              imageClassName="object-cover"
            />
          </div>
          <textarea
            className="mt-7 min-h-36 w-full resize-none rounded-[18px] border border-gray-100 bg-white p-5 text-base text-black-950 shadow-card outline-none placeholder:text-gray-400 focus:border-primary"
            value={flow.memo}
            onChange={(event) => updateFlow({ memo: event.target.value })}
            placeholder="이 순간을 한 줄로 남겨주세요"
          />
          {errorMessage ? <p className="mt-4 text-sm text-danger">{errorMessage}</p> : null}
          <div className="mt-auto grid grid-cols-[0.8fr_1.2fr] gap-3 pb-3 pt-6">
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

function RecordHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="relative flex h-14 translate-y-[29px] items-center justify-center">
      <button className="absolute left-0 flex h-10 w-10 items-center justify-center" type="button" aria-label="이전" onClick={onBack}>
        <img className="h-5 w-5 opacity-80" src={leftarrowIcon} alt="" aria-hidden="true" />
      </button>
      <h1 className="px-12 text-center text-2xl font-bold leading-8 text-black-950">{title}</h1>
    </header>
  );
}
