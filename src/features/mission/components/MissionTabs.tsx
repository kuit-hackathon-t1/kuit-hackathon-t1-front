import type { MissionStatus } from "@/features/mission/types/mission";
import Button from "@/shared/ui/Button";

export type MissionTab = "ALL" | Extract<MissionStatus, "ACTIVE" | "SUCCESS" | "FAILURE">;

const items: { value: MissionTab; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "ACTIVE", label: "진행 중" },
  { value: "SUCCESS", label: "완료" },
  { value: "FAILURE", label: "실패" },
];

export default function MissionTabs({ value, onChange }: { value: MissionTab; onChange: (value: MissionTab) => void }) {
  return (
    <div className="flex items-center gap-2">
      {items.map((item) => (
        <Button
          key={item.value}
          type="button"
          size="sm"
          variant={value === item.value ? "greenOutline" : "grayOutline"}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
