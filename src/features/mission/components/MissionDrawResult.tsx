import shuffleIcon from "@/assets/icons/shuffle.svg";
import { getMissionCategoryMeta } from "@/features/mission/lib/missionCategory";
import type { Mission } from "@/features/mission/types/mission";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";

type MissionDrawResultProps = {
  mission: Mission;
  onRetry: () => void;
  onStart: () => void;
  startDisabled?: boolean;
};

export default function MissionDrawResult({
  mission,
  onRetry,
  onStart,
  startDisabled = false,
}: MissionDrawResultProps) {
  const categoryMeta = getMissionCategoryMeta(mission.category);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#FFFFF7] px-2 py-4">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <h2 className="text-lg font-bold text-black-950">이번 미션은</h2>
        <Card className="mt-5 w-full max-w-[300px] rounded-[18px] border-gray-200 bg-white p-4 shadow-card">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${categoryMeta.className}`}>
            {categoryMeta.label}
          </span>
          <h3 className="mt-3 text-xl font-bold leading-7 text-black-950">{mission.title}</h3>
          <p className="mt-8 text-xs leading-5 text-black-700">{mission.description}</p>
        </Card>
        <div className="mt-4 flex w-full max-w-[300px] justify-end">
          <Button
            type="button"
            size="xs"
            className="min-h-8 px-4"
            onClick={onRetry}
            leftIcon={<img className="h-4 w-4" src={shuffleIcon} alt="" />}
          >
            다시 뽑기
          </Button>
        </div>
      </div>
      <div className="shrink-0 pb-3">
        <Button type="button" variant="greenOutline" fullWidth size="lg" onClick={onStart} disabled={startDisabled}>
          이 미션 시작하기
        </Button>
      </div>
    </div>
  );
}
