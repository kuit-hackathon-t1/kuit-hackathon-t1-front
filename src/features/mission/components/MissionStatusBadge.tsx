import type { MissionStatus } from "@/features/mission/types/mission";
import { cn } from "@/shared/lib/cn";

const labels: Record<MissionStatus, string> = {
  RECOMMENDED: "추천",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
  FAILED: "실패",
  EXPIRED: "만료",
};

export default function MissionStatusBadge({ status }: { status: MissionStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs font-semibold",
        status === "COMPLETED" && "bg-emerald-100 text-emerald-800",
        status === "FAILED" && "bg-neutral-200 text-neutral-600",
        status === "IN_PROGRESS" && "bg-amber-100 text-amber-800",
        status === "RECOMMENDED" && "bg-sky-100 text-sky-800",
        status === "EXPIRED" && "bg-rose-100 text-rose-800",
      )}
    >
      {labels[status]}
    </span>
  );
}
