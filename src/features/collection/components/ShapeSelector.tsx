import type { InsectShape } from "@/features/collection/types/collection";
import { cn } from "@/shared/lib/cn";

const shapes: { value: InsectShape; label: string }[] = [
  { value: "BUTTERFLY", label: "나비" },
  { value: "BEETLE", label: "딱정벌레" },
  { value: "DRAGONFLY", label: "잠자리" },
];

export default function ShapeSelector({
  value,
  onChange,
}: {
  value: InsectShape;
  onChange: (shape: InsectShape) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {shapes.map((shape) => (
        <button
          key={shape.value}
          type="button"
          className={cn(
            "min-h-11 rounded-lg border px-2 text-sm font-semibold",
            value === shape.value ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-neutral-200 bg-white text-neutral-600",
          )}
          onClick={() => onChange(shape.value)}
        >
          {shape.label}
        </button>
      ))}
    </div>
  );
}
