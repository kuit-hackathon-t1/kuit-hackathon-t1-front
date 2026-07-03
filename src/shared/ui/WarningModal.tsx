import warningIcon from "@/assets/icons/warning.svg";
import Button from "@/shared/ui/Button";

type WarningModalProps = {
  open: boolean;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function WarningModal({
  open,
  title,
  description,
  cancelLabel = "마무리하기",
  confirmLabel = "계속 작성하기",
  onCancel,
  onConfirm,
}: WarningModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5">
      <section
        className="w-full max-w-[340px] rounded-[20px] bg-white px-2 pt-8 pb-3"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex min-h-16 items-center justify-center">
          <img className="size-16" src={warningIcon} alt="" />
        </div>

        <div className="mt-5 text-center">
          <h2 className="text-subtitle-20 text-gray-900">{title}</h2>
          <p className="mt-3 text-body-14 text-off">{description}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="grayOutline"
            fullWidth
            className="border-transparent bg-gray-50 text-gray-900 hover:bg-gray-200"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button type="button" fullWidth onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}
