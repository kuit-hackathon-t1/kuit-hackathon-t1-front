export type RecordResultStatus = "SUCCESS" | "FAILURE";

export type RecordDraft = {
  tripId: number;
  missionId: number;
  status: RecordResultStatus;
  memo: string;
  imageFile: File | null;
};
