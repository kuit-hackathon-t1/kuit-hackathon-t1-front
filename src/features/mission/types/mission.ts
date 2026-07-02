export type MissionStatus = "RECOMMENDED" | "ACTIVE" | "SUCCESS" | "FAILURE";
export type MissionCategory = "OBSERVATION" | "ACTION" | "LOCAL" | "RANDOM";
export type Difficulty = "EASY" | "NORMAL" | "HARD";

export type MissionListItem = {
  missionId: number;
  tripId: number;
  title: string;
  description: string;
  category: MissionCategory;
  difficulty?: Difficulty;
  status: MissionStatus;
  createdAt?: string;
  startedAt?: string;
};

export type MissionDetail = MissionListItem & {
  userId?: number;
  completedAt?: string;
  failedAt?: string;
};

export type RandomMissionResponse = MissionDetail;
export type StartMissionResponse = MissionDetail;

export type Mission = MissionDetail;
