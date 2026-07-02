import type { CSSProperties } from "react";

import type { CollectionStatus, CropType } from "@/features/collection/types/collection";
import { cn } from "@/shared/lib/cn";

type SpecimenImageProps = {
  imageUrl: string | null;
  cropType: CropType;
  status: CollectionStatus;
  alt?: string;
  className?: string;
  imageClassName?: string;
  variant?: "framed" | "bare";
};

const specimenShapeUrlByCropType: Record<CropType, string> = {
  SNAIL: "/images/specimen/snail.svg",
  BEETLE: "/images/specimen/beetle.svg",
  BUTTERFLY: "/images/specimen/butterfly.svg",
  MOTH: "/images/specimen/moth.svg",
};

export default function SpecimenImage({
  imageUrl,
  cropType,
  status,
  alt = "채집 이미지",
  className,
  imageClassName,
  variant = "framed",
}: SpecimenImageProps) {
  const maskStyle: CSSProperties = {
    WebkitMask: `url(${specimenShapeUrlByCropType[cropType]}) center / contain no-repeat`,
    mask: `url(${specimenShapeUrlByCropType[cropType]}) center / contain no-repeat`,
  };

  return (
    <div
      className={cn(
        "aspect-square w-full overflow-hidden",
        variant === "framed" && "rounded-lg border bg-neutral-100",
        variant === "framed" && (status === "FAILURE" ? "border-dashed border-neutral-400" : "border-neutral-200"),
        status === "FAILURE" && "opacity-60 grayscale",
        className,
      )}
    >
      {imageUrl ? (
        <img className={cn("h-full w-full object-cover", imageClassName)} src={imageUrl} alt={alt} style={maskStyle} />
      ) : variant === "bare" ? (
        <div className="flex h-full w-full items-center justify-center text-[10px] font-medium leading-none text-neutral-400">
          이미지 없음
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-neutral-400">이미지 없음</div>
      )}
    </div>
  );
}
