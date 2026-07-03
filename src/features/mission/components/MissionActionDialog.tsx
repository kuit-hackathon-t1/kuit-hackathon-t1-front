import closeIcon from "@/assets/icons/close.svg";
import leftarrowIcon from "@/assets/icons/leftarrow.svg";
import { getMissionCategoryMeta } from "@/features/mission/lib/missionCategory";
import type { Mission } from "@/features/mission/types/mission";
import Button from "@/shared/ui/Button";

type MissionResultStatus = "SUCCESS" | "FAILURE";

type MissionActionDialogProps = {
  mission: Mission;
  selectedStatus: MissionResultStatus | null;
  onSelectStatus: (status: MissionResultStatus) => void;
  onClose: () => void;
  onBack: () => void;
  onRecord: () => void;
};

export default function MissionActionDialog({
  mission,
  selectedStatus,
  onSelectStatus,
  onClose,
  onBack,
  onRecord,
}: MissionActionDialogProps) {
  return (
    <div className="fixed inset-0 z-[60] mx-auto flex w-full max-w-[430px] items-center justify-center bg-black/35 px-5 py-6">
      <section className="relative flex max-h-[calc(100dvh-48px)] w-full max-w-[320px] flex-col overflow-y-auto rounded-[24px] bg-white px-4 pb-4 pt-6 shadow-card">
        {selectedStatus === "FAILURE" ? (
          <IconButton className="left-4 top-6" icon={leftarrowIcon} label="이전" onClick={onBack} />
        ) : (
          <IconButton className="left-4 top-6" icon={closeIcon} label="닫기" onClick={onClose} />
        )}
        {selectedStatus === "FAILURE" ? null : (
          <h1 className="px-10 text-center text-xl font-bold leading-7 text-black-950">진행중인 미션</h1>
        )}

        {selectedStatus === null ? (
          <MissionSelectView mission={mission} onSelectStatus={onSelectStatus} />
        ) : selectedStatus === "SUCCESS" ? (
          <SuccessConfirmView onClose={onClose} onRecord={onRecord} />
        ) : (
          <FailureConfirmView mission={mission} onClose={onClose} onRecord={onRecord} />
        )}
      </section>
    </div>
  );
}

function IconButton({
  className,
  icon,
  label,
  onClick,
}: {
  className: string;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className={`absolute flex h-8 w-8 items-center justify-center ${className}`} type="button" aria-label={label} onClick={onClick}>
      <img className="h-5 w-5 opacity-70" src={icon} alt="" aria-hidden="true" />
    </button>
  );
}

function MissionSelectView({
  mission,
  onSelectStatus,
}: {
  mission: Mission;
  onSelectStatus: (status: MissionResultStatus) => void;
}) {
  return (
    <>
      <MissionSummaryCard mission={mission} className="mt-6" />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <DialogButton variant="gray" onClick={() => onSelectStatus("FAILURE")}>
          실패
        </DialogButton>
        <DialogButton variant="green" onClick={() => onSelectStatus("SUCCESS")}>
          성공
        </DialogButton>
      </div>
    </>
  );
}

function SuccessConfirmView({ onClose, onRecord }: { onClose: () => void; onRecord: () => void }) {
  return (
    <div className="pt-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E3F5F1]">
        <span className="text-3xl leading-none" aria-hidden="true">
          ✨
        </span>
      </div>
      <h2 className="mt-6 text-xl font-bold leading-7 text-black-950">고생했어요!</h2>
      <p className="mt-3 whitespace-pre-line text-sm font-medium leading-6 text-black-500">
        {"미션을 성공적으로 완료했어요.\n성공의 순간을 사진으로 채집해 볼까요?"}
      </p>
      <DialogActionButtons onClose={onClose} onRecord={onRecord} />
    </div>
  );
}

function FailureConfirmView({ mission, onClose, onRecord }: { mission: Mission; onClose: () => void; onRecord: () => void }) {
  return (
    <>
      <MissionSummaryCard mission={mission} className="mt-7" />
      <div className="mt-6 text-center">
        <h2 className="text-xl font-bold leading-7 text-black-950">미션에 실패하셨나요?</h2>
        <p className="mt-3 whitespace-pre-line text-sm font-medium leading-6 text-black-950">
          {"미션에 실패해도 추억은 채집할 수 있어요.\n실패한 추억을 채집해볼까요?"}
        </p>
      </div>
      <DialogActionButtons onClose={onClose} onRecord={onRecord} />
    </>
  );
}

function MissionSummaryCard({ mission, className = "" }: { mission: Mission; className?: string }) {
  const categoryMeta = getMissionCategoryMeta(mission.category);

  return (
    <article className={`rounded-[20px] bg-white px-4 py-4 shadow-card ${className}`}>
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold leading-none ${categoryMeta.className}`}>
        {categoryMeta.label}
      </span>
      <h2 className="mt-4 text-2xl font-bold leading-[1.2] text-black-950">{mission.title}</h2>
      <p className="mt-5 text-sm font-medium leading-6 text-black-950">{mission.description}</p>
    </article>
  );
}

function DialogActionButtons({ onClose, onRecord }: { onClose: () => void; onRecord: () => void }) {
  return (
    <div className="mt-5 grid grid-cols-[0.85fr_1.65fr] gap-3">
      <DialogButton variant="gray" onClick={onClose}>
        나가기
      </DialogButton>
      <DialogButton variant="green" onClick={onRecord}>
        사진 채집하기
      </DialogButton>
    </div>
  );
}

function DialogButton({
  variant,
  onClick,
  children,
}: {
  variant: "gray" | "green";
  onClick: () => void;
  children: string;
}) {
  return (
    <Button
      className={
        variant === "green"
          ? "min-h-12 w-full text-base font-bold leading-none"
          : "min-h-12 w-full bg-gray-100 text-base font-bold leading-none text-black-950 hover:bg-gray-200"
      }
      size="lg"
      type="button"
      variant={variant === "green" ? "primary" : "grayFilled"}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
