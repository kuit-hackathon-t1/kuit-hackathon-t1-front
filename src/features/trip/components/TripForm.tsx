import { useState, type FormEvent } from "react";

import type { CompanionType, TripCreatePayload, TripMood } from "@/features/trip/types/trip";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import Input from "@/shared/ui/Input";

type TripFormProps = {
  onSubmit: (payload: TripCreatePayload) => Promise<void>;
};

export default function TripForm({ onSubmit }: TripFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [tripName, setTripName] = useState("");
  const [region, setRegion] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [companionType, setCompanionType] = useState<CompanionType>("ALONE");
  const [mood, setMood] = useState<TripMood>("EMOTIONAL");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ tripName, region, startDate, endDate, companionType, mood });
    setIsSubmitting(false);
  }

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-neutral-700">
          여행 이름
          <Input className="mt-2" value={tripName} onChange={(event) => setTripName(event.target.value)} required />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          지역
          <Input className="mt-2" value={region} onChange={(event) => setRegion(event.target.value)} required />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium text-neutral-700">
            시작일
            <Input className="mt-2" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
          </label>
          <label className="block text-sm font-medium text-neutral-700">
            종료일
            <Input className="mt-2" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required />
          </label>
        </div>
        <label className="block text-sm font-medium text-neutral-700">
          동행
          <select
            className="mt-2 min-h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm"
            value={companionType}
            onChange={(event) => setCompanionType(event.target.value as CompanionType)}
          >
            <option value="ALONE">혼자</option>
            <option value="FRIEND">친구</option>
            <option value="COUPLE">연인</option>
            <option value="FAMILY">가족</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          여행 무드
          <select
            className="mt-2 min-h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm"
            value={mood}
            onChange={(event) => setMood(event.target.value as TripMood)}
          >
            <option value="EMOTIONAL">감성</option>
            <option value="WANDERING">탐험</option>
            <option value="LOCAL">로컬</option>
            <option value="COURAGE">도전</option>
          </select>
        </label>
        <Button className="w-full" disabled={isSubmitting}>
          여행 시작
        </Button>
      </form>
    </Card>
  );
}
