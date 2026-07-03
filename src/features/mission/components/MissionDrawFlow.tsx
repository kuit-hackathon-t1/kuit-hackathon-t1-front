import { useCallback, useEffect, useRef, useState } from "react";

import leftArrowIcon from "@/assets/icons/leftarrow.svg";
import shuffleIcon from "@/assets/icons/shuffle.svg";
import MissionDrawLoading from "@/features/mission/components/MissionDrawLoading";
import MissionDrawResult from "@/features/mission/components/MissionDrawResult";
import { useRandomMissionMutation } from "@/features/mission/queries/useRandomMissionMutation";
import { useStartMissionMutation } from "@/features/mission/queries/useStartMissionMutation";
import type { Mission } from "@/features/mission/types/mission";
import Button from "@/shared/ui/Button";

type DrawPhase = "idle" | "loading" | "result" | "error";

type MissionDrawFlowProps = {
  userId?: number;
  tripId?: number;
  autoStart?: boolean;
  onClose: () => void;
  onStarted?: (missionId: number) => void;
};

export default function MissionDrawFlow({ userId, tripId, autoStart = false, onClose, onStarted }: MissionDrawFlowProps) {
  const randomMissionMutation = useRandomMissionMutation(userId, tripId);
  const startMissionMutation = useStartMissionMutation(userId, tripId);
  const [phase, setPhase] = useState<DrawPhase>(autoStart ? "loading" : "idle");
  const [pickedMission, setPickedMission] = useState<Mission | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const autoStartedRef = useRef(false);

  const startDraw = useCallback(async () => {
    setPhase("loading");
    setPickedMission(null);
    setErrorMessage(null);

    try {
      const mission = await randomMissionMutation.mutateAsync();
      setPickedMission(mission);
      setPhase("result");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "미션을 뽑지 못했습니다.");
      setPhase("error");
    }
  }, [randomMissionMutation]);

  useEffect(() => {
    if (!autoStart || autoStartedRef.current || userId === undefined || tripId === undefined) return;
    autoStartedRef.current = true;
    void startDraw();
  }, [autoStart, startDraw, tripId, userId]);

  async function handleStartMission() {
    if (!pickedMission) return;
    await startMissionMutation.mutateAsync(pickedMission.missionId);
    onStarted?.(pickedMission.missionId);
  }

  return (
    <div>
      <button className="mb-5 text-sm font-semibold text-primary" type="button" onClick={onClose}>
        <img className="mr-1 inline h-4 w-4 align-[-2px]" src={leftArrowIcon} alt="" aria-hidden="true" />
        미션 목록
      </button>

      {phase === "loading" ? <MissionDrawLoading /> : null}

      {phase === "result" && pickedMission ? (
        <MissionDrawResult
          mission={pickedMission}
          onRetry={startDraw}
          onStart={handleStartMission}
          retryDisabled={randomMissionMutation.isPending}
          startDisabled={startMissionMutation.isPending}
        />
      ) : null}

      {phase === "error" ? (
        <div className="rounded-[28px] border border-gray-200 bg-white p-5 text-center shadow-card">
          <p className="text-base font-bold text-black-950">미션을 뽑지 못했어요</p>
          <p className="mt-3 text-sm leading-6 text-danger">{errorMessage}</p>
          <Button className="mt-6 w-full" onClick={startDraw} disabled={randomMissionMutation.isPending}>
            <img className="h-4 w-4" src={shuffleIcon} alt="" aria-hidden="true" />
            다시 뽑기
          </Button>
        </div>
      ) : null}

      {phase === "idle" ? (
        <div className="rounded-[28px] border border-gray-200 bg-white p-5 text-center shadow-card">
          <p className="text-base font-bold text-black-950">새 미션을 뽑아볼까요?</p>
          <Button className="mt-6 w-full" onClick={startDraw} disabled={randomMissionMutation.isPending || tripId === undefined}>
            <img className="h-4 w-4" src={shuffleIcon} alt="" aria-hidden="true" />
            미션 뽑기
          </Button>
        </div>
      ) : null}
    </div>
  );
}
