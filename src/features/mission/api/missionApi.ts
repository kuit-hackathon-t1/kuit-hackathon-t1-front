import type {
  MissionDetail,
  MissionListItem,
  MissionStatus,
  RandomMissionResponse,
  StartMissionResponse,
} from "@/features/mission/types/mission";
import { endpoints } from "@/shared/api/endpoints";
import { fetchClient } from "@/shared/api/fetchClient";

export async function createRandomMission(userId: number, tripId: number): Promise<RandomMissionResponse> {
  return fetchClient.post<RandomMissionResponse>(endpoints.missions.random(tripId), undefined, { userId });
}

export async function startMission(userId: number, missionId: number): Promise<StartMissionResponse> {
  return fetchClient.patch<StartMissionResponse>(endpoints.missions.start(missionId), undefined, { userId });
}

export async function getMissions(
  userId: number,
  tripId: number,
  status?: MissionStatus,
): Promise<MissionListItem[]> {
  return fetchClient.get<MissionListItem[]>(endpoints.missions.list(tripId, status), { userId });
}

export async function getMission(userId: number, missionId: number): Promise<MissionDetail> {
  return fetchClient.get<MissionDetail>(endpoints.missions.detail(missionId), { userId });
}
