import closeIcon from "@/assets/icons/close.svg";
import { getTripMoodMeta } from "@/features/trip/lib/tripMoodMeta";
import { companionLabels, type Trip } from "@/features/trip/types/trip";
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

  const moodMeta = getTripMoodMeta(trip.mood);

  return (
    <div className="fixed inset-0 z-[70] mx-auto flex w-full max-w-[430px] items-center justify-center bg-black/35 px-5 py-6">
      <Card className="max-h-[calc(100dvh-48px)] w-full max-w-[340px] overflow-y-auto rounded-[28px] border-gray-200 bg-white px-4 py-5 shadow-card">
        <div className="grid grid-cols-[40px_1fr_40px] items-center">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-black-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            <img className="h-3.5 w-3.5 opacity-60" src={closeIcon} alt="" aria-hidden="true" />
          </button>
          <h2 className="text-center text-lg font-bold text-black-950">여행 정보</h2>
          <div aria-hidden="true" />
        </div>

        <section className="mt-9 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-[22px] font-bold leading-tight text-black-950">{trip.tripName}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm leading-6 text-black-700">
              <span>{trip.region}</span>
              <span aria-hidden="true">·</span>
              <span>
                {trip.startDate} - {trip.status === "ACTIVE" ? "진행중" : "종료"}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold leading-5 text-black-700">
                {companionLabels[trip.companionType]}
              </span>
            </div>
          </div>

          <div className="w-[66px] shrink-0 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
              <img className="h-8 w-8" src={moodMeta.icon} alt="" aria-hidden="true" />
            </div>
            <p className="mt-2 text-xs font-medium leading-5 text-black-700">{moodMeta.label}</p>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-3 bg-secondary px-3 py-3 text-center">
          <Stat label="성공" value={trip.missionSummary.successCount} tone="primary" />
          <Stat label="실패" value={trip.missionSummary.failedCount} />
          <Stat label="기록" value={trip.collectionSummary.totalCount} />
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <Button
            type="button"
            variant="greenOutline"
            fullWidth
            className="min-h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={onClose}
          >
            닫기
          </Button>
          <Button
            type="button"
            variant="grayOutline"
            fullWidth
            className="min-h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={onRequestEnd}
          >
            여행 마무리하기
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, tone = "muted" }: { label: string; value: number; tone?: "primary" | "muted" }) {
  return (
    <div className="px-2 py-1">
      <p className={`text-xl font-bold ${tone === "primary" ? "text-primary" : "text-black-700"}`}>{value}</p>
      <p className="mt-1 text-xs text-gray-600">{label}</p>
    </div>
  );
}