import type { CropType } from "@/features/collection/types/collection";
import { cn } from "@/shared/lib/cn";

const shapes: { value: CropType; label: string; icon: string }[] = [
  { value: "SNAIL", label: "달팽이", icon: "/images/specimen/snail-icon.svg" },
  { value: "BEETLE", label: "딱정벌레", icon: "/images/specimen/beetle-icon.svg" },
  { value: "BUTTERFLY", label: "나비", icon: "/images/specimen/butterfly-icon.svg" },
  { value: "MOTH", label: "나방", icon: "/images/specimen/moth-icon.svg" },
];

export default function ShapeSelector({
  value,
  onChange,
}: {
  value: CropType | null;
  onChange: (shape: CropType) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2 rounded-[24px] bg-gray-100 p-2">
      {shapes.map((shape) => (
        <button
          key={shape.value}
          type="button"
          className={cn(
            "flex min-h-24 flex-col items-center justify-center rounded-[20px] border bg-white px-2 py-3 text-xs font-semibold text-black-700 shadow-sm transition-colors",
            value === shape.value ? "border-primary ring-2 ring-primary/30" : "border-gray-200",
          )}
          onClick={() => onChange(shape.value)}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
            <img
              className="h-9 w-9 object-contain"
              src={shape.icon}
              alt=""
              aria-hidden="true"
              onError={(event) => event.currentTarget.remove()}
            />
          </span>
          <span className="mt-2">{shape.label}</span>
        </button>
      ))}
    </div>
  );
}
