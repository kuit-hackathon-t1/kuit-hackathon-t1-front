import MissionStatusBadge from "@/features/mission/components/MissionStatusBadge";
import type { Mission } from "@/features/mission/types/mission";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";

type MissionCardProps = {
  mission: Mission;
  onStart?: (mission: Mission) => void;
  onOpen?: (mission: Mission) => void;
};

export default function MissionCard({ mission, onStart, onOpen }: MissionCardProps) {
  const canStart = mission.status === "RECOMMENDED";
  const canOpen = mission.status === "ACTIVE" || mission.status === "SUCCESS" || mission.status === "FAILURE";
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-neutral-950">{mission.title}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{mission.description}</p>
        </div>
        <MissionStatusBadge status={mission.status} />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
        <span>{mission.category}</span>
        <span>{mission.isLocal ? "LOCAL" : "RANDOM"}</span>
      </div>
    </>
  );

  return (
    <Card>
      {canOpen && onOpen ? (
        <button className="block w-full text-left" type="button" onClick={() => onOpen(mission)}>
          {content}
        </button>
      ) : (
        content
      )}
      {canStart ? (
        <div className="mt-4">
          <Button className="w-full" onClick={() => onStart?.(mission)}>
            미션 시작
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
