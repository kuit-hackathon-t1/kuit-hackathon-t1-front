import type { MissionStatus } from "@/features/mission/types/mission";
import { cn } from "@/shared/lib/cn";

const labels: Record<MissionStatus, string> = {
  DRAWN: "선택됨",
  ACTIVE: "진행 중",
  SUCCESS: "완료",
  FAILURE: "실패",
};

export default function MissionStatusBadge({ status }: { status: MissionStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs font-semibold",
        status === "SUCCESS" && "bg-emerald-100 text-emerald-800",
        status === "FAILURE" && "bg-neutral-200 text-neutral-600",
        status === "ACTIVE" && "bg-amber-100 text-amber-800",
        status === "DRAWN" && "bg-sky-100 text-sky-800",
      )}
    >
      {labels[status]}
    </span>
  );
}
