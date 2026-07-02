import type { Mission, MissionStatus } from "@/features/mission/types/mission";

const MISSIONS_KEY = "mock-missions";

const missionSeeds = [
  {
    title: "낯선 골목의 색 찾기",
    description: "지금 있는 지역에서 가장 눈에 띄는 색을 가진 장면을 찾아보세요.",
    missionType: "OBSERVATION" as const,
    difficulty: "EASY" as const,
  },
  {
    title: "오늘의 소리 채집",
    description: "여행지에서만 들을 수 있는 소리가 느껴지는 장면을 사진으로 남겨보세요.",
    missionType: "COLLECTION" as const,
    difficulty: "NORMAL" as const,
  },
  {
    title: "현지 표지판 발견",
    description: "지역 이름이나 방언, 특색 있는 안내가 담긴 표지판을 찾아보세요.",
    missionType: "OBSERVATION" as const,
    difficulty: "EASY" as const,
  },
  {
    title: "한 걸음 더 들어가기",
    description: "처음 보이는 길보다 한 블록 더 안쪽으로 들어가 발견한 장면을 남겨보세요.",
    missionType: "ACTION" as const,
    difficulty: "HARD" as const,
  },
];

function readMissions(): Mission[] {
  const raw = localStorage.getItem(MISSIONS_KEY);
  return raw ? (JSON.parse(raw) as Mission[]) : [];
}

function writeMissions(missions: Mission[]) {
  localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
}

export async function generateMission(userId: number, tripId: number): Promise<Mission> {
  const seed = missionSeeds[Math.floor(Math.random() * missionSeeds.length)];
  const mission: Mission = {
    id: Date.now(),
    userId,
    tripId,
    title: seed.title,
    description: seed.description,
    missionType: seed.missionType,
    difficulty: seed.difficulty,
    status: "RECOMMENDED",
    createdAt: new Date().toISOString(),
  };

  writeMissions([...readMissions(), mission]);
  return mission;
}

export async function startMission(missionId: number, userId: number): Promise<Mission> {
  const missions = readMissions();
  const target = missions.find((mission) => mission.id === missionId && mission.userId === userId);

  if (!target) {
    throw new Error("Mission not found");
  }

  const updated: Mission = {
    ...target,
    status: "IN_PROGRESS",
    startedAt: target.startedAt ?? new Date().toISOString(),
  };

  writeMissions(missions.map((mission) => (mission.id === missionId ? updated : mission)));
  return updated;
}

export async function completeMission(
  missionId: number,
  userId: number,
  status: Extract<MissionStatus, "COMPLETED" | "FAILED">,
): Promise<Mission> {
  const missions = readMissions();
  const target = missions.find((mission) => mission.id === missionId && mission.userId === userId);

  if (!target) {
    throw new Error("Mission not found");
  }

  const now = new Date().toISOString();
  const updated: Mission = {
    ...target,
    status,
    completedAt: status === "COMPLETED" ? now : target.completedAt,
    failedAt: status === "FAILED" ? now : target.failedAt,
  };

  writeMissions(missions.map((mission) => (mission.id === missionId ? updated : mission)));
  return updated;
}

export async function getMissions(tripId: number, status?: MissionStatus): Promise<Mission[]> {
  return readMissions().filter(
    (mission) => mission.tripId === tripId && (!status || mission.status === status),
  );
}

export async function getMission(missionId: number): Promise<Mission | null> {
  return readMissions().find((mission) => mission.id === missionId) ?? null;
}
