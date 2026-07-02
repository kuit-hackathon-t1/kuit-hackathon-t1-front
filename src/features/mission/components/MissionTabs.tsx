import type { MissionStatus } from "@/features/mission/types/mission";
import Tabs, { type TabItem } from "@/shared/ui/Tabs";

export type MissionTab = "ALL" | Extract<MissionStatus, "IN_PROGRESS" | "COMPLETED" | "FAILED">;

const items: TabItem<MissionTab>[] = [
  { value: "ALL", label: "전체" },
  { value: "IN_PROGRESS", label: "진행" },
  { value: "COMPLETED", label: "완료" },
  { value: "FAILED", label: "실패" },
];

export default function MissionTabs({ value, onChange }: { value: MissionTab; onChange: (value: MissionTab) => void }) {
  return <Tabs items={items} value={value} onChange={onChange} />;
}
