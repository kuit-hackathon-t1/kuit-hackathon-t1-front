import warningIcon from "@/assets/icons/warning.svg";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";

type TripEndConfirmDialogProps = {
  open: boolean;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function TripEndConfirmDialog({ open, isPending = false, onClose, onConfirm }: TripEndConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] mx-auto flex w-full max-w-[430px] items-center justify-center bg-black/35 px-5 py-6">
      <Card className="w-full max-w-[320px] rounded-[28px] border-gray-200 bg-white p-5 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft">
          <img className="h-7 w-7" src={warningIcon} alt="" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-black-950">이 여행을 마무리할까요?</h2>
        <p className="mt-3 text-sm leading-6 text-black-700">마무리한 여행은 다시 수정할 수 없어요.</p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="grayFilled"
            disabled={isPending}
            className="min-h-12 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={onConfirm}
          >
            마무리하기
          </Button>
          <Button
            type="button"
            disabled={isPending}
            className="min-h-12 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={onClose}
          >
            계속 여행하기
          </Button>
        </div>
      </Card>
    </div>
  );
}
