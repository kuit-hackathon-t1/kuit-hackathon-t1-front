import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import MissionDrawLoading from "@/features/mission/components/MissionDrawLoading";
import MissionDrawResult from "@/features/mission/components/MissionDrawResult";
import { useRandomMissionMutation } from "@/features/mission/queries/useRandomMissionMutation";
import { useStartMissionMutation } from "@/features/mission/queries/useStartMissionMutation";
import type { Mission } from "@/features/mission/types/mission";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useCreateTripMutation } from "@/features/trip/queries/useCreateTripMutation";
import type { CompanionType, TripCreatePayload, TripMood } from "@/features/trip/types/trip";
import { ApiError } from "@/shared/api/ApiError";
import { cn } from "@/shared/lib/cn";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import Input from "@/shared/ui/Input";
import PageHeader from "@/shared/ui/PageHeader";

type TripWizardState = {
  region: string;
  startDate: string;
  endDate: string;
  companionType: CompanionType | null;
  mood: TripMood | null;
  tripName: string;
};

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const initialState: TripWizardState = {
  region: "",
  startDate: "",
  endDate: "",
  companionType: null,
  mood: null,
  tripName: "",
};

const companionOptions: { value: CompanionType; label: string; description: string }[] = [
  { value: "ALONE", label: "혼자", description: "내 속도로 천천히" },
  { value: "FRIEND", label: "친구", description: "함께 발견하는 여행" },
  { value: "COUPLE", label: "연인", description: "둘만의 장면 채집" },
  { value: "FAMILY", label: "가족", description: "가족과 함께 남기는 여행" },
];

const moodOptions: { value: TripMood; label: string; description: string }[] = [
  { value: "EMOTIONAL", label: "감성 남기기", description: "빛, 색, 분위기를 오래 기억해요" },
  { value: "WANDERING", label: "헤매기", description: "골목과 우연을 따라 걸어요" },
  { value: "LOCAL", label: "지역 느끼기", description: "동네의 표정을 가까이 봐요" },
  { value: "COURAGE", label: "조금 용기내기", description: "평소보다 한 걸음 더 해봐요" },
];

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 409) {
    return error.message || "이미 진행 중인 여행이 있습니다.";
  }

  return error instanceof Error ? error.message : "여행을 생성하지 못했습니다.";
}

export default function TripCreatePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.currentUser);
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<TripWizardState>(initialState);
  const [createdTripId, setCreatedTripId] = useState<number | null>(null);
  const [pickedMission, setPickedMission] = useState<Mission | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createTripMutation = useCreateTripMutation(user?.userId);
  const randomMissionMutation = useRandomMissionMutation(user?.userId, createdTripId ?? undefined);
  const startMissionMutation = useStartMissionMutation(user?.userId, createdTripId ?? undefined);

  function updateForm(patch: Partial<TripWizardState>) {
    setForm((current) => ({ ...current, ...patch }));
    setErrorMessage(null);
  }

  function validateStep() {
    if (step === 1 && !form.region.trim()) return "여행지를 입력해주세요.";
    if (step === 2) {
      if (!form.startDate || !form.endDate) return "여행 기간을 입력해주세요.";
      if (form.startDate > form.endDate) return "종료일은 시작일 이후여야 합니다.";
    }
    if (step === 3 && !form.companionType) return "동행을 선택해주세요.";
    if (step === 4 && !form.mood) return "여행 분위기를 선택해주세요.";
    if (step === 5 && !form.tripName.trim()) return "여행 이름을 입력해주세요.";
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationMessage = validateStep();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    if (step < 5) {
      setStep((current) => (current + 1) as WizardStep);
      return;
    }

    if (!form.companionType || !form.mood) return;

    const payload: TripCreatePayload = {
      region: form.region.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      companionType: form.companionType,
      mood: form.mood,
      tripName: form.tripName.trim(),
    };

    try {
      const trip = await createTripMutation.mutateAsync(payload);
      setCreatedTripId(trip.tripId);
      setStep(6);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  async function handlePickMission() {
    setErrorMessage(null);
    setPickedMission(null);
    setStep(7);
    try {
      const mission = await randomMissionMutation.mutateAsync();
      setPickedMission(mission);
    } catch (error) {
      setStep(6);
      setErrorMessage(error instanceof Error ? error.message : "미션을 뽑지 못했습니다.");
    }
  }

  async function handleStartMission() {
    if (!pickedMission) return;
    await startMissionMutation.mutateAsync(pickedMission.missionId);
    navigate("/home", { replace: true });
  }

  if (!user) return null;

  return (
    <div className="-mx-5 -my-6 min-h-dvh bg-[#FFFFF7] px-5 py-6">
      {step <= 5 ? (
        <>
          <PageHeader title="새 여행 만들기" />
          <form className="flex min-h-[calc(100dvh-112px)] flex-col" onSubmit={handleSubmit}>
            <Progress step={step} />
            <div className="mt-8 flex-1">
              {step === 1 ? <RegionStep value={form.region} onChange={(region) => updateForm({ region })} /> : null}
              {step === 2 ? (
                <DateStep
                  startDate={form.startDate}
                  endDate={form.endDate}
                  onChange={(patch) => updateForm(patch)}
                />
              ) : null}
              {step === 3 ? (
                <OptionGrid
                  title="누구와 갈까요?"
                  options={companionOptions}
                  value={form.companionType}
                  onChange={(companionType) => updateForm({ companionType })}
                />
              ) : null}
              {step === 4 ? (
                <OptionGrid
                  title="여행의 분위기를 골라주세요"
                  options={moodOptions}
                  value={form.mood}
                  onChange={(mood) => updateForm({ mood })}
                />
              ) : null}
              {step === 5 ? <NameStep value={form.tripName} onChange={(tripName) => updateForm({ tripName })} /> : null}
              {errorMessage ? <p className="mt-5 text-sm text-danger">{errorMessage}</p> : null}
            </div>
            <div className="grid grid-cols-2 gap-2 pb-3">
              <Button type="button" variant="grayOutline" disabled={step === 1} onClick={() => setStep((current) => (current - 1) as WizardStep)}>
                이전
              </Button>
              <Button disabled={createTripMutation.isPending}>{step === 5 ? "채집 시작하기" : "다음"}</Button>
            </div>
          </form>
        </>
      ) : null}

      {step === 6 ? (
        <CreatedStep
          form={form}
          errorMessage={errorMessage}
          onPickMission={handlePickMission}
          disabled={randomMissionMutation.isPending || !createdTripId}
        />
      ) : null}

      {step === 7 ? (
        randomMissionMutation.isPending || !pickedMission ? (
          <MissionDrawLoading />
        ) : (
          <MissionDrawResult
            mission={pickedMission}
            onRetry={handlePickMission}
            onStart={handleStartMission}
            retryDisabled={randomMissionMutation.isPending}
            startDisabled={startMissionMutation.isPending}
          />
        )
      ) : null}
    </div>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div>
      <p className="text-sm font-semibold text-primary">{Math.min(step, 5)} / 5</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }} />
      </div>
    </div>
  );
}

function RegionStep({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <section>
      <h1 className="text-3xl font-bold text-black-950">어디로 여행할까요?</h1>
      <label className="mt-8 block text-sm font-semibold text-black-700">
        여행 지역
        <Input className="mt-3 min-h-14 rounded-2xl bg-white px-4 text-base shadow-card" value={value} onChange={(event) => onChange(event.target.value)} placeholder="예: 경주, 부산 해운대" />
      </label>
      <Button className="mt-4" type="button" variant="greenOutline" onClick={() => console.log("현재 여행지 찾기")}>
        현재 여행지 찾기
      </Button>
    </section>
  );
}

function DateStep({
  startDate,
  endDate,
  onChange,
}: {
  startDate: string;
  endDate: string;
  onChange: (patch: Partial<TripWizardState>) => void;
}) {
  return (
    <section>
      <h1 className="text-3xl font-bold text-black-950">얼마나 여행할까요?</h1>
      <div className="mt-8 grid gap-4">
        <label className="block text-sm font-semibold text-black-700">
          시작일
          <Input className="mt-3 min-h-14 rounded-2xl bg-white px-4 shadow-card" type="date" value={startDate} onChange={(event) => onChange({ startDate: event.target.value })} />
        </label>
        <label className="block text-sm font-semibold text-black-700">
          종료일
          <Input className="mt-3 min-h-14 rounded-2xl bg-white px-4 shadow-card" type="date" value={endDate} onChange={(event) => onChange({ endDate: event.target.value })} />
        </label>
      </div>
    </section>
  );
}

function OptionGrid<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { value: T; label: string; description: string }[];
  value: T | null;
  onChange: (value: T) => void;
}) {
  return (
    <section>
      <h1 className="text-3xl font-bold leading-10 text-black-950">{title}</h1>
      <div className="mt-8 grid grid-cols-2 gap-3">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              className={cn(
                "min-h-36 rounded-[24px] border bg-white p-4 text-left shadow-card transition-colors",
                selected ? "border-primary text-primary" : "border-gray-200 text-black-700",
              )}
              onClick={() => onChange(option.value)}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">+</span>
              <span className="mt-5 block text-lg font-bold">{option.label}</span>
              <span className="mt-2 block text-xs leading-5 text-gray-600">{option.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function NameStep({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <section>
      <h1 className="text-3xl font-bold leading-10 text-black-950">여행의 이름을 지어주세요</h1>
      <p className="mt-4 text-sm leading-6 text-black-700">이름이 여행의 특색을 담으면, 미션에 반영할 수 있어요</p>
      <Input className="mt-8 min-h-14 rounded-2xl bg-white px-4 text-base shadow-card" value={value} onChange={(event) => onChange(event.target.value)} placeholder="예: 여름 골목 채집" />
    </section>
  );
}

function CreatedStep({
  form,
  errorMessage,
  onPickMission,
  disabled,
}: {
  form: TripWizardState;
  errorMessage: string | null;
  onPickMission: () => void;
  disabled: boolean;
}) {
  const companionLabel = companionOptions.find((option) => option.value === form.companionType)?.label;

  return (
    <section className="flex min-h-[calc(100dvh-48px)] flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-4xl font-bold text-white">✓</div>
      <h1 className="mt-8 text-3xl font-bold text-black-950">여행이 시작됐어요</h1>
      <Card className="mt-8 w-full rounded-[28px] border-gray-200 text-left">
        <p className="text-xl font-bold text-black-950">{form.tripName}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">{form.region}</span>
          <span className="rounded-full bg-gray-50 px-3 py-1 text-xs text-black-700">
            {form.startDate} - {form.endDate}
          </span>
          {companionLabel ? <span className="rounded-full bg-gray-50 px-3 py-1 text-xs text-black-700">{companionLabel}</span> : null}
        </div>
      </Card>
      {errorMessage ? <p className="mt-5 text-sm text-danger">{errorMessage}</p> : null}
      <Button className="mt-auto w-full" size="lg" onClick={onPickMission} disabled={disabled}>
        첫 미션 뽑기
      </Button>
    </section>
  );
}
