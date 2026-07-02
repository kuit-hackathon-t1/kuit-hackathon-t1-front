import type { MissionStatus } from "@/features/mission/types/mission";

export const missionKeys = {
  all: ["missions"] as const,
  list: (tripId?: number, status?: MissionStatus) =>
    status === undefined ? ([...missionKeys.all, "list", tripId] as const) : ([...missionKeys.all, "list", tripId, status] as const),
  detail: (missionId?: number) => [...missionKeys.all, "detail", missionId] as const,
};
