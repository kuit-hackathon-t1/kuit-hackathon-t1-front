import type {
  Mission,
  MissionDto,
  MissionListResponseDto,
  MissionStatus,
  RandomMissionResponse,
  StartMissionResponse,
  StartMissionResponseDto,
} from "@/features/mission/types/mission";
import { endpoints } from "@/shared/api/endpoints";
import { fetchClient } from "@/shared/api/fetchClient";

function toMission(dto: MissionDto): Mission {
  return {
    missionId: dto.missionId,
    tripId: dto.tripId,
    title: dto.title,
    description: dto.description,
    category: dto.missionCategory,
    status: dto.missionStatus,
    isLocal: dto.isLocal,
    guides: dto.guides,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export async function createRandomMission(userId: number, tripId: number): Promise<RandomMissionResponse> {
  const response = await fetchClient.post<MissionDto>(endpoints.missions.random(tripId), undefined, { userId });
  return toMission(response);
}

export async function startMission(userId: number, missionId: number): Promise<StartMissionResponse> {
  const response = await fetchClient.patch<StartMissionResponseDto>(endpoints.missions.start(missionId), undefined, {
    userId,
  });

  return {
    missionId: response.missionId,
    status: response.missionStatus,
    updatedAt: response.updatedAt,
  };
}

export async function getMissions(userId: number, tripId: number, status?: MissionStatus): Promise<Mission[]> {
  const response = await fetchClient.get<MissionListResponseDto>(endpoints.missions.list(tripId, status), { userId });
  return response.missions.map((mission) =>
    toMission({
      ...mission,
      tripId: mission.tripId ?? response.tripId,
    }),
  );
}

export async function getMission(userId: number, missionId: number): Promise<Mission> {
  const response = await fetchClient.get<MissionDto>(endpoints.missions.detail(missionId), { userId });
  return toMission(response);
}
