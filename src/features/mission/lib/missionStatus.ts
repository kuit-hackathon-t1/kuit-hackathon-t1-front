import type { MissionStatus } from "@/features/mission/types/mission";

export const HIDDEN_MISSION_STATUSES = ["DRAWN", "CANCELLED"] satisfies MissionStatus[];

export function isVisibleMissionStatus(status: MissionStatus) {
  return !(HIDDEN_MISSION_STATUSES as readonly MissionStatus[]).includes(status);
}

export const missionStatusMeta = {
  ACTIVE: {
    label: "진행 중",
    className: "border-black-800 text-black-800",
  },
  SUCCESS: {
    label: "성공",
    className: "border-primary text-primary",
  },
  FAILURE: {
    label: "실패",
    className: "border-off text-off",
  },
  DRAWN: {
    label: "대기",
    className: "border-gray-400 text-gray-500",
  },
  CANCELLED: {
    label: "취소됨",
    className: "border-gray-400 text-gray-500",
  },
} satisfies Record<MissionStatus, { label: string; className: string }>;

export function getMissionStatusMeta(status: MissionStatus) {
  return missionStatusMeta[status];
}
