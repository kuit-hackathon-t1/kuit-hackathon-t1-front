import type { CropType } from "@/features/collection/types/collection";
import { cn } from "@/shared/lib/cn";

const shapes: { value: CropType; label: string; src: string }[] = [
  { value: "SNAIL", label: "달팽이", src: "/images/specimen/snail.svg" },
  { value: "BEETLE", label: "딱정벌레", src: "/images/specimen/beetle.svg" },
  { value: "BUTTERFLY", label: "나비", src: "/images/specimen/butterfly.svg" },
  { value: "MOTH", label: "나방", src: "/images/specimen/moth.svg" },
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
            "flex min-h-24 flex-col items-center justify-center rounded-[20px] border bg-white px-1 py-3 text-xs font-semibold shadow-sm transition-colors",
            value === shape.value ? "border-primary text-primary ring-2 ring-primary/25" : "border-gray-200 text-gray-500",
          )}
          onClick={() => onChange(shape.value)}
        >
          <span
            className="h-12 w-12 bg-current"
            style={{
              WebkitMask: `url(${shape.src}) center / contain no-repeat`,
              mask: `url(${shape.src}) center / contain no-repeat`,
            }}
            aria-hidden="true"
          />
          <span className="mt-2 text-center leading-4">{shape.label}</span>
        </button>
      ))}
    </div>
  );
}
