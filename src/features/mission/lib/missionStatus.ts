import type { MissionStatus } from "@/features/mission/types/mission";

type MissionStatusMeta = {
  label: string;
  className: string;
};

export const HIDDEN_MISSION_STATUSES = ["RECOMMENDED", "CANCELLED"] satisfies MissionStatus[];

export function isVisibleMissionStatus(status: MissionStatus | string) {
  return !(HIDDEN_MISSION_STATUSES as readonly string[]).includes(status);
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
  RECOMMENDED: {
    label: "대기",
    className: "border-gray-400 text-gray-500",
  },
  CANCELLED: {
    label: "취소됨",
    className: "border-gray-400 text-gray-500",
  },
} satisfies Record<MissionStatus, MissionStatusMeta>;

const fallbackMissionStatusMeta: MissionStatusMeta = {
  label: "알 수 없음",
  className: "border-gray-400 text-gray-500",
};

export function getMissionStatusMeta(status: MissionStatus | string) {
  return missionStatusMeta[status as MissionStatus] ?? fallbackMissionStatusMeta;
}
