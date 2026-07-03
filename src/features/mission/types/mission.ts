export type MissionStatus = "DRAWN" | "ACTIVE" | "SUCCESS" | "FAILURE";
export type MissionCategory = "OBSERVATION" | "ACTION" | "LOCAL" | "RANDOM";

export type MissionDto = {
  missionId: number;
  tripId: number;
  title: string;
  description: string;
  missionCategory: MissionCategory;
  missionStatus: MissionStatus;
  isLocal: boolean;
  guides?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type MissionListItemDto = Omit<MissionDto, "tripId"> & {
  tripId?: number;
};

export type MissionListResponseDto = {
  tripId: number;
  missions: MissionListItemDto[];
};

export type Mission = {
  missionId: number;
  tripId: number;
  title: string;
  description: string;
  category: MissionCategory;
  status: MissionStatus;
  isLocal: boolean;
  guides?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type StartMissionResponseDto = {
  missionId: number;
  missionStatus: "ACTIVE";
  updatedAt: string;
};

export type StartMissionResponse = {
  missionId: number;
  status: "ACTIVE";
  updatedAt: string;
};

export type RandomMissionResponse = Mission;
export type MissionListItem = Mission;
export type MissionDetail = Mission;
