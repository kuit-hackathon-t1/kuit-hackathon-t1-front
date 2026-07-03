import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import leftArrowIcon from "@/assets/icons/leftarrow.svg";
import moodCourageIcon from "@/assets/icons/mood-courage.svg";
import moodEmotionalIcon from "@/assets/icons/mood-emotional.svg";
import moodLocalIcon from "@/assets/icons/mood-local.svg";
import moodWanderingIcon from "@/assets/icons/mood-wandering.svg";
import okayIcon from "@/assets/icons/okay.svg";
import { useAuthStore } from "@/features/auth/stores/authStore";
import MissionDrawLoading from "@/features/mission/components/MissionDrawLoading";
import MissionDrawResult from "@/features/mission/components/MissionDrawResult";
import { useRandomMissionMutation } from "@/features/mission/queries/useRandomMissionMutation";
import { useStartMissionMutation } from "@/features/mission/queries/useStartMissionMutation";
import type { Mission } from "@/features/mission/types/mission";
import { useCreateTripMutation } from "@/features/trip/queries/useCreateTripMutation";
import type { CompanionType, TripCreatePayload, TripMood } from "@/features/trip/types/trip";
import { ApiError } from "@/shared/api/ApiError";
import { cn } from "@/shared/lib/cn";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";

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

const moodOptions: { value: TripMood; label: string; description: string; icon: string }[] = [
  { value: "EMOTIONAL", label: "감성 남기기", description: "여행의 분위기를 사진과 문장으로 남겨요", icon: moodEmotionalIcon },
  { value: "WANDERING", label: "헤매기", description: "계획에서 벗어난 순간을 중심으로 채집해요", icon: moodWanderingIcon },
  { value: "LOCAL", label: "지역 느끼기", description: "계획에서 벗어난 순간을 중심으로 채집해요", icon: moodLocalIcon },
  { value: "COURAGE", label: "조금 용기내기", description: "평소보다 지나쳤을 순간에 한걸음 다가가요", icon: moodCourageIcon },
];

const validationMessages: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "여행지를 입력해야 여행을 시작할 수 있어요.",
  2: "여행 기간을 정해야 채집을 시작할 수 있어요.",
  3: "함께 가는 사람을 선택해주세요.",
  4: "여행 분위기를 선택해주세요.",
  5: "이번 채집을 기억할 이름을 지어주세요.",
};

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
    if (step === 1 && !form.region.trim()) return validationMessages[1];
    if (step === 2) {
      if (!form.startDate || !form.endDate) return validationMessages[2];
      if (form.startDate > form.endDate) return "종료일은 시작일 이후여야 합니다.";
    }
    if (step === 3 && !form.companionType) return validationMessages[3];
    if (step === 4 && !form.mood) return validationMessages[4];
    if (step === 5 && !form.tripName.trim()) return validationMessages[5];
    return null;
  }

  function moveToStep(nextStep: WizardStep) {
    setErrorMessage(null);
    setStep(nextStep);
  }

  function handleBack() {
    setErrorMessage(null);
    if (step === 1) {
      navigate("/home");
      return;
    }

    setStep((current) => (current - 1) as WizardStep);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationMessage = validateStep();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    if (step < 5) {
      moveToStep((step + 1) as WizardStep);
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
    <div
      className={cn(
        "-mx-5 -my-6 min-h-dvh bg-[#FFFFF7] px-5 py-6",
        step === 7 && "flex h-dvh min-h-0 flex-col overflow-hidden",
      )}
    >
      {step <= 5 ? (
        <form className="flex min-h-[calc(100dvh-48px)] flex-col" onSubmit={handleSubmit}>
          <WizardHeader step={step} onBack={handleBack} />
          <div className="mt-9 flex-1">
            {step === 2 ? (
              <DateStep
                step={step}
                startDate={form.startDate}
                endDate={form.endDate}
                onChange={(patch) => updateForm(patch)}
                errorMessage={errorMessage}
              />
            ) : null}
            {step === 1 ? (
              <RegionStep step={step} value={form.region} onChange={(region) => updateForm({ region })} errorMessage={errorMessage} />
            ) : null}
            {step === 3 ? (
              <CompanionStep
                step={step}
                value={form.companionType}
                onChange={(companionType) => updateForm({ companionType })}
                errorMessage={errorMessage}
              />
            ) : null}
            {step === 4 ? <MoodStep step={step} value={form.mood} onChange={(mood) => updateForm({ mood })} errorMessage={errorMessage} /> : null}
            {step === 5 ? (
              <NameStep step={step} value={form.tripName} onChange={(tripName) => updateForm({ tripName })} errorMessage={errorMessage} />
            ) : null}
          </div>
          <div className="pb-3">
            <Button
              className={cn("w-full text-xl", step < 5 && "bg-transparent")}
              variant={step === 5 ? "primary" : "greenOutline"}
              size="lg"
              disabled={createTripMutation.isPending}
            >
              {step === 5 ? "채집 시작하기" : "다음"}
            </Button>
          </div>
        </form>
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
            startDisabled={startMissionMutation.isPending}
          />
        )
      ) : null}
    </div>
  );
}

function WizardHeader({ step, onBack }: { step: WizardStep; onBack: () => void }) {
  const progress = getDisplayStep(step);

  return (
    <header>
      <h1 className="text-center text-xl font-bold leading-5 text-black-700">새 여행 만들기</h1>
      <div className="mt-5 flex items-center gap-3">
        <button className="-ml-1 flex h-8 w-8 items-center justify-center" type="button" aria-label="뒤로가기" onClick={onBack}>
          <img className="h-5 w-5" src={leftArrowIcon} alt="" aria-hidden="true" />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(progress / 4) * 100}%` }} />
        </div>
      </div>
    </header>
  );
}

function getDisplayStep(step: WizardStep) {
  if (step <= 2) return step;
  if (step <= 4) return 3;
  return 4;
}

function StepTitle({ step, children }: { step: WizardStep; children: string }) {
  return (
    <div className="flex items-center gap-4">
      <p className="w-8 shrink-0 text-base font-medium leading-4 text-neutral-400">{getDisplayStep(step)}/4</p>
      <h2 className="min-w-0 text-2xl font-semibold leading-9 text-black-950">{children}</h2>
    </div>
  );
}

function FieldError({ message }: { message: string | null }) {
  return message ? <p className="mt-3 text-xs leading-5 text-danger">{message}</p> : null;
}

function inputClassName(extra?: string) {
  return cn(
    "min-h-12 rounded-[10px] bg-neutral-100 px-3.5 text-sm text-off shadow-[0_4px_4px_rgba(0,0,0,0.10)] placeholder:text-neutral-400",
    extra,
  );
}

function RegionStep({
  step,
  value,
  onChange,
  errorMessage,
}: {
  step: WizardStep;
  value: string;
  onChange: (value: string) => void;
  errorMessage: string | null;
}) {
  return (
    <section>
      <StepTitle step={step}>어디로 여행할까요?</StepTitle>
      <Input
        className={inputClassName("mt-16")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="예: 경주, 부산 해운대..."
      />
      <FieldError message={errorMessage} />
    </section>
  );
}

function DateStep({
  step,
  startDate,
  endDate,
  onChange,
  errorMessage,
}: {
  step: WizardStep;
  startDate: string;
  endDate: string;
  onChange: (patch: Partial<TripWizardState>) => void;
  errorMessage: string | null;
}) {
  return (
    <section>
      <StepTitle step={step}>얼마나 여행할까요?</StepTitle>
      <div className="mt-16 flex items-center gap-3">
        <Input
          className={inputClassName("min-w-0 flex-1")}
          type="date"
          value={startDate}
          onChange={(event) => onChange({ startDate: event.target.value })}
          aria-label="시작일"
        />
        <span className="shrink-0 text-sm leading-5 text-neutral-400">—</span>
        <Input
          className={inputClassName("min-w-0 flex-1")}
          type="date"
          value={endDate}
          onChange={(event) => onChange({ endDate: event.target.value })}
          aria-label="종료일"
        />
      </div>
      <FieldError message={errorMessage} />
    </section>
  );
}

function CompanionStep({
  step,
  value,
  onChange,
  errorMessage,
}: {
  step: WizardStep;
  value: CompanionType | null;
  onChange: (value: CompanionType) => void;
  errorMessage: string | null;
}) {
  return (
    <section>
      <StepTitle step={step}>누구와 갈까요?</StepTitle>
      <div className="mt-14 grid grid-cols-2 gap-2">
        {companionOptions.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              className={cn(
                "flex min-h-20 items-center justify-center rounded-[10px] border-2 bg-transparent p-4 text-center text-base font-medium leading-6 transition-colors",
                selected ? "border-primary bg-primary-soft text-primary" : "border-primary text-black-700",
              )}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <FieldError message={errorMessage} />
    </section>
  );
}

function MoodStep({
  step,
  value,
  onChange,
  errorMessage,
}: {
  step: WizardStep;
  value: TripMood | null;
  onChange: (value: TripMood) => void;
  errorMessage: string | null;
}) {
  return (
    <section>
      <StepTitle step={step}>여행의 분위기를 골라주세요</StepTitle>
      <p className="ml-12 mt-1 text-xs leading-5 text-primary">미션에 반영돼요</p>
      <div className="mt-11 space-y-3">
        {moodOptions.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              className={cn(
                "flex min-h-[92px] w-full items-center gap-4 rounded-[10px] border-2 bg-transparent px-5 py-4 text-left transition-colors",
                selected ? "border-primary bg-primary-soft" : "border-primary",
              )}
              onClick={() => onChange(option.value)}
            >
              <img className="h-10 w-10 shrink-0" src={option.icon} alt="" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-base font-medium leading-6 text-black-700">{option.label}</span>
                <span className="mt-1 block text-xs leading-5 text-black-700">{option.description}</span>
              </span>
            </button>
          );
        })}
      </div>
      <FieldError message={errorMessage} />
    </section>
  );
}

function NameStep({
  step,
  value,
  onChange,
  errorMessage,
}: {
  step: WizardStep;
  value: string;
  onChange: (value: string) => void;
  errorMessage: string | null;
}) {
  return (
    <section>
      <StepTitle step={step}>여행의 이름을 지어주세요</StepTitle>
      <p className="ml-12 mt-1 text-xs leading-5 text-primary">이름이 여행의 특색을 담으면, 미션에 반영할 수 있어요</p>
      <Input
        className={inputClassName("mt-14")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="예: 경주 딴길 여행"
      />
      <FieldError message={errorMessage} />
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
    <section className="flex min-h-[calc(100dvh-48px)] flex-col text-center">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary-soft">
          <img className="h-7 w-7" src={okayIcon} alt="" aria-hidden="true" />
        </div>
        <p className="mt-7 text-xs leading-5 text-black-700">여행이 시작됐어요</p>
        <h1 className="mt-2 text-2xl font-bold leading-9 text-black-950">{form.tripName}</h1>
        <p className="mt-2 text-xs leading-5 text-black-700">
          {form.region} · {form.startDate} - {form.endDate}
        </p>
        {companionLabel ? (
          <span className="mt-2 rounded-full bg-gray-100 px-4 py-1 text-xs font-medium leading-5 text-black-700">{companionLabel}</span>
        ) : null}
        {errorMessage ? <p className="mt-5 text-sm text-danger">{errorMessage}</p> : null}
      </div>
      <Button className="w-full" size="lg" type="button" onClick={onPickMission} disabled={disabled}>
        첫 미션 뽑기
      </Button>
    </section>
  );
}
