import { Link } from "react-router";

import MissionStatusBadge from "@/features/mission/components/MissionStatusBadge";
import type { Mission } from "@/features/mission/types/mission";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";

type MissionCardProps = {
  mission: Mission;
  onStart?: (mission: Mission) => void;
};

export default function MissionCard({ mission, onStart }: MissionCardProps) {
  const canStart = mission.status === "RECOMMENDED";
  const canOpen = mission.status === "IN_PROGRESS";

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-neutral-950">{mission.title}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{mission.description}</p>
        </div>
        <MissionStatusBadge status={mission.status} />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
        <span>{mission.missionType}</span>
        <span>{mission.difficulty}</span>
      </div>
      {canStart || canOpen ? (
        <div className="mt-4">
          {canStart ? (
            <Button className="w-full" onClick={() => onStart?.(mission)}>
              미션 시작
            </Button>
          ) : null}
          {canOpen ? (
            <Link to={`/missions/${mission.id}/progress`}>
              <Button className="mt-2 w-full" variant="secondary">
                진행 화면으로 이동
              </Button>
            </Link>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
