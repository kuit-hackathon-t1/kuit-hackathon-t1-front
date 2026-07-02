import type { MissionStatus } from "@/features/mission/types/mission";
import Tabs, { type TabItem } from "@/shared/ui/Tabs";

export type MissionTab = "ALL" | Extract<MissionStatus, "ACTIVE" | "SUCCESS" | "FAILURE">;

const items: TabItem<MissionTab>[] = [
  { value: "ALL", label: "전체" },
  { value: "ACTIVE", label: "진행" },
  { value: "SUCCESS", label: "완료" },
  { value: "FAILURE", label: "실패" },
];

export default function MissionTabs({ value, onChange }: { value: MissionTab; onChange: (value: MissionTab) => void }) {
  return <Tabs items={items} value={value} onChange={onChange} />;
}
