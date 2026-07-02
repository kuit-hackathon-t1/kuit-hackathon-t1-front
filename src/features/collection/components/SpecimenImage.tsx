import type { CollectionStatus, CropType } from "@/features/collection/types/collection";
import { cn } from "@/shared/lib/cn";

type SpecimenImageProps = {
  imageUrl: string | null;
  cropType: CropType;
  status: CollectionStatus;
  alt?: string;
};

const shapeClass: Record<CropType, string> = {
  BUTTERFLY: "[clip-path:polygon(50%_12%,62%_31%,94%_14%,78%_50%,96%_86%,60%_70%,50%_90%,40%_70%,4%_86%,22%_50%,6%_14%,38%_31%)]",
  BEETLE: "[clip-path:ellipse(38%_47%_at_50%_52%)]",
  DRAGONFLY: "[clip-path:polygon(50%_5%,58%_37%,94%_20%,66%_50%,94%_80%,58%_63%,50%_95%,42%_63%,6%_80%,34%_50%,6%_20%,42%_37%)]",
};

export default function SpecimenImage({ imageUrl, cropType, status, alt = "채집 이미지" }: SpecimenImageProps) {
  return (
    <div
      className={cn(
        "aspect-square w-full overflow-hidden rounded-lg border bg-neutral-100",
        status === "FAILURE" ? "border-dashed border-neutral-400 opacity-60 grayscale" : "border-neutral-200",
      )}
    >
      {imageUrl ? (
        <img className={cn("h-full w-full object-cover", shapeClass[cropType])} src={imageUrl} alt={alt} />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-neutral-400">이미지 없음</div>
      )}
    </div>
  );
}
