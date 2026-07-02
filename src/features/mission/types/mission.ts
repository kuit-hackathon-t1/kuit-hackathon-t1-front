export type MissionStatus =
  | "RECOMMENDED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "EXPIRED";
export type MissionType = "OBSERVATION" | "COLLECTION" | "ACTION" | "RANDOM";
export type Difficulty = "EASY" | "NORMAL" | "HARD";

export type Mission = {
  id: number;
  userId: number;
  tripId: number;
  title: string;
  description: string;
  missionType: MissionType;
  difficulty: Difficulty;
  status: MissionStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
};
