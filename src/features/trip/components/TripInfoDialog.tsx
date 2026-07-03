import closeIcon from "@/assets/icons/close.svg";
import { companionLabels, moodLabels, type Trip } from "@/features/trip/types/trip";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";

type TripInfoDialogProps = {
  trip: Trip;
  open: boolean;
  onClose: () => void;
  onRequestEnd: () => void;
};

export default function TripInfoDialog({ trip, open, onClose, onRequestEnd }: TripInfoDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] mx-auto flex w-full max-w-[430px] items-end justify-center bg-black/20 px-5 pb-24 pt-6">
      <Card className="max-h-[76dvh] w-full max-w-[360px] overflow-y-auto rounded-[28px] border-gray-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-black-950">여행 정보</h2>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-2xl text-black-700"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            <img className="h-4 w-4" src={closeIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 rounded-[22px] border border-gray-200 bg-[#FFFFF7] p-4">
          <h3 className="text-xl font-bold text-black-950">{trip.tripName}</h3>
          <p className="mt-2 text-sm leading-6 text-black-700">
            {trip.region} · {trip.startDate} - {trip.endDate} · {trip.status === "ACTIVE" ? "진행 중" : "종료"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
              {companionLabels[trip.companionType]}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-black-700">
              {moodLabels[trip.mood]}
            </span>
          </div>
        </div>

<<<<<<< Updated upstream
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <Stat label="성공" value={trip.missionSummary.successCount} />
=======
          <div className="mt-3 w-[66px] shrink-0 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
              <img className="h-8 w-8" src={moodMeta.icon} alt="" aria-hidden="true" />
            </div>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-3 bg-secondary px-3 py-3 text-center">
          <Stat label="성공" value={trip.missionSummary.successCount} tone="primary" />
>>>>>>> Stashed changes
          <Stat label="실패" value={trip.missionSummary.failedCount} />
          <Stat label="기록" value={trip.collectionSummary.totalCount} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button type="button" variant="grayOutline" onClick={onClose}>
            닫기
          </Button>
          <Button type="button" onClick={onRequestEnd}>
            여행 마무리하기
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-gray-50 px-2 py-3">
      <p className="text-xl font-bold text-black-950">{value}</p>
      <p className="mt-1 text-xs text-gray-600">{label}</p>
    </div>
  );
}
