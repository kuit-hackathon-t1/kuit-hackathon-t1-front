import type { CSSProperties } from "react";

import type { MissionCategory } from "@/features/mission/types/mission";

type MissionCategoryMeta = {
  label: string;
  className: string;
  style?: CSSProperties;
};

const missionCategoryMeta: Record<MissionCategory, MissionCategoryMeta> = {
  RANDOM: {
    label: "즉흥",
    className: "bg-[#EB5E88] text-white",
  },
  OBSERVATION: {
    label: "수집",
    className: "bg-[#57B1A8] text-white",
  },
  ACTION: {
    label: "감각",
    className: "bg-[#422F0F] text-white",
  },
  LOCAL: {
    label: "지역",
    className: "bg-[#008F5D] text-white",
  },
};

export function getMissionCategoryMeta(category: MissionCategory) {
  return missionCategoryMeta[category];
}
