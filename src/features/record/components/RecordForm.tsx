import { useState, type FormEvent } from "react";

import type { RecordDraft, RecordResultStatus } from "@/features/record/types/record";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";

type RecordFormProps = {
  tripId: number;
  missionId: number;
  status: RecordResultStatus;
  onSubmit: (draft: RecordDraft) => void;
};

export default function RecordForm({ tripId, missionId, status, onSubmit }: RecordFormProps) {
  const [memo, setMemo] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!imageFile) return;
    onSubmit({ tripId, missionId, status, memo, imageFile });
  }

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-neutral-700">
          사진
          <input
            className="mt-2 block w-full text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            required
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          한줄평
          <textarea
            className="mt-2 min-h-28 w-full rounded-lg border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-emerald-700"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="이 장면을 짧게 남겨주세요."
          />
        </label>
        <Button className="w-full" disabled={!imageFile}>
          사진 조각 만들기
        </Button>
      </form>
    </Card>
  );
}
