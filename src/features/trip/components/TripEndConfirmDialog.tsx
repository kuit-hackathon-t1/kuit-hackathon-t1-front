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
    <div className="fixed inset-x-0 bottom-0 z-[80] mx-auto flex w-full max-w-[430px] items-end justify-center bg-black/25 px-5 pb-24 pt-6">
      <Card className="w-full max-w-[360px] rounded-[28px] border-gray-200 bg-white p-5 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-2xl text-danger">!</div>
        <h2 className="mt-4 text-xl font-bold text-black-950">이 여행을 마무리할까요?</h2>
        <p className="mt-3 text-sm leading-6 text-black-700">마무리한 여행은 다시 수정할 수 없어요.</p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button type="button" variant="grayOutline" disabled={isPending} onClick={onClose}>
            계속 여행하기
          </Button>
          <Button type="button" disabled={isPending} onClick={onConfirm}>
            마무리하기
          </Button>
        </div>
      </Card>
    </div>
  );
}
