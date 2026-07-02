import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import { useRandomMissionMutation } from "@/features/mission/queries/useRandomMissionMutation";
import { useStartMissionMutation } from "@/features/mission/queries/useStartMissionMutation";
import type { Mission } from "@/features/mission/types/mission";
import { useCreateTripMutation } from "@/features/trip/queries/useCreateTripMutation";
import type { CompanionType, TripCreatePayload, TripMood } from "@/features/trip/types/trip";
import { ApiError } from "@/shared/api/ApiError";
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

const initialState: TripWizardState = {
  region: "",
  startDate: "",
  endDate: "",
  companionType: null,
  mood: null,
  tripName: "",
};

const companionOptions: { value: CompanionType; label: string }[] = [
  { value: "ALONE", label: "혼자" },
  { value: "FRIEND", label: "친구" },
  { value: "COUPLE", label: "연인" },
  { value: "ETC", label: "기타" },
];

const moodOptions: { value: TripMood; label: string }[] = [
  { value: "EMOTIONAL", label: "감성" },
  { value: "WANDERING", label: "탐험" },
  { value: "LOCAL", label: "로컬" },
  { value: "COURAGE", label: "도전" },
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
  const [step, setStep] = useState(1);
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
      setStep((current) => current + 1);
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
      console.error(error);
      setErrorMessage(getErrorMessage(error));
    }
  }

  async function handlePickMission() {
    setErrorMessage(null);
    try {
      const mission = await randomMissionMutation.mutateAsync();
      setPickedMission(mission);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "미션을 뽑지 못했습니다.");
    }
  }

  async function handleStartMission() {
    if (!pickedMission) return;
    const mission = await startMissionMutation.mutateAsync(pickedMission.missionId);
    navigate(`/missions/${mission.missionId}/progress`);
  }

  if (!user) return null;

  return (
    <>
      <PageHeader title="새 여행 만들기" description="여행 단위로 미션과 채집 기록을 묶습니다." />
      <Card>
        <div className="mb-4 text-sm text-neutral-500">Step {step} / 6</div>
        {step < 6 ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {step === 1 ? (
              <label className="block text-sm font-medium text-neutral-700">
                여행지
                <Input className="mt-2" value={form.region} onChange={(event) => updateForm({ region: event.target.value })} />
              </label>
            ) : null}

            {step === 2 ? (
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-medium text-neutral-700">
                  시작일
                  <Input
                    className="mt-2"
                    type="date"
                    value={form.startDate}
                    onChange={(event) => updateForm({ startDate: event.target.value })}
                  />
                </label>
                <label className="block text-sm font-medium text-neutral-700">
                  종료일
                  <Input
                    className="mt-2"
                    type="date"
                    value={form.endDate}
                    onChange={(event) => updateForm({ endDate: event.target.value })}
                  />
                </label>
              </div>
            ) : null}

            {step === 3 ? (
              <OptionGroup
                options={companionOptions}
                value={form.companionType}
                onChange={(companionType) => updateForm({ companionType })}
              />
            ) : null}

            {step === 4 ? (
              <OptionGroup options={moodOptions} value={form.mood} onChange={(mood) => updateForm({ mood })} />
            ) : null}

            {step === 5 ? (
              <label className="block text-sm font-medium text-neutral-700">
                여행 이름
                <Input className="mt-2" value={form.tripName} onChange={(event) => updateForm({ tripName: event.target.value })} />
              </label>
            ) : null}

            {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" disabled={step === 1} onClick={() => setStep((current) => current - 1)}>
                이전
              </Button>
              <Button disabled={createTripMutation.isPending}>{step === 5 ? "여행 생성" : "다음"}</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-lg font-bold text-neutral-950">여행이 생성되었습니다</p>
              <p className="mt-2 text-sm text-neutral-600">첫 미션을 뽑고 바로 시작할 수 있습니다.</p>
            </div>
            {pickedMission ? (
              <div className="rounded-lg border border-neutral-200 p-3">
                <p className="font-semibold text-neutral-950">{pickedMission.title}</p>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{pickedMission.description}</p>
              </div>
            ) : null}
            {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
            <div className="grid gap-2">
              <Button onClick={handlePickMission} disabled={randomMissionMutation.isPending || !createdTripId}>
                첫 미션 뽑기
              </Button>
              {pickedMission ? (
                <Button variant="secondary" onClick={handleStartMission} disabled={startMissionMutation.isPending}>
                  이 미션 시작하기
                </Button>
              ) : null}
              <Button type="button" variant="ghost" onClick={() => navigate("/missions")}>
                미션 목록으로 이동
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

function OptionGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-2">
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? "primary" : "secondary"}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
