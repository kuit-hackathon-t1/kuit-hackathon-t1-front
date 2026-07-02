import type { CSSProperties } from "react";

import type { CollectionStatus, CropType } from "@/features/collection/types/collection";
import { cn } from "@/shared/lib/cn";

type SpecimenImageProps = {
  imageUrl: string | null;
  cropType: CropType;
  status: CollectionStatus;
  alt?: string;
};

const maskUrlByCropType: Record<CropType, string> = {
  SNAIL: "/images/specimen/snail-mask.svg",
  BEETLE: "/images/specimen/beetle-mask.svg",
  BUTTERFLY: "/images/specimen/butterfly-mask.svg",
  MOTH: "/images/specimen/moth-mask.svg",
};

export default function SpecimenImage({ imageUrl, cropType, status, alt = "채집 이미지" }: SpecimenImageProps) {
  const maskStyle: CSSProperties = {
    WebkitMask: `url(${maskUrlByCropType[cropType]}) center / contain no-repeat`,
    mask: `url(${maskUrlByCropType[cropType]}) center / contain no-repeat`,
  };

  return (
    <div
      className={cn(
        "aspect-square w-full overflow-hidden rounded-lg border bg-neutral-100",
        status === "FAILURE" ? "border-dashed border-neutral-400 opacity-60 grayscale" : "border-neutral-200",
      )}
    >
      {imageUrl ? (
        <img className="h-full w-full object-cover" src={imageUrl} alt={alt} style={maskStyle} />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-neutral-400">이미지 없음</div>
      )}
    </div>
  );
}
