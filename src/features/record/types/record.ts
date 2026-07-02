export type RecordResultStatus = "COMPLETED" | "FAILED";

export type RecordDraft = {
  tripId: number;
  missionId: number;
  status: RecordResultStatus;
  memo: string;
  imageFile: File | null;
};
