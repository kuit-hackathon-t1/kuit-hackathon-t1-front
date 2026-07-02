import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { useLocalImageUrl } from "@/features/collection/hooks/useLocalImageUrl";
import type { CollectionListItem } from "@/features/collection/types/collection";
import { cn } from "@/shared/lib/cn";

type SpecimenTileProps = {
  collection: CollectionListItem;
  index: number;
  onClick: () => void;
  variant?: "book" | "card";
};

const positions = [
  "left-[12%] top-[18%] h-20 w-20 rotate-[-12deg]",
  "left-[52%] top-[19%] h-24 w-24 rotate-[8deg]",
  "left-[25%] top-[49%] h-28 w-28 rotate-[2deg]",
  "left-[62%] top-[53%] h-28 w-28 rotate-[-7deg]",
  "left-[39%] top-[34%] h-20 w-20 rotate-[18deg]",
  "left-[10%] top-[62%] h-20 w-20 rotate-[11deg]",
  "left-[70%] top-[30%] h-[72px] w-[72px] rotate-[-3deg]",
  "left-[36%] top-[66%] h-[72px] w-[72px] rotate-[9deg]",
];

export default function SpecimenTile({ collection, index, onClick, variant = "book" }: SpecimenTileProps) {
  const { imageUrl } = useLocalImageUrl(collection.imageId);
  const isBook = variant === "book";

  return (
    <button
      className={cn(
        "transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isBook
          ? "absolute bg-transparent p-0"
          : "h-16 w-16 rounded-2xl bg-white/90 p-1 shadow-card",
        isBook && positions[index % positions.length],
      )}
      type="button"
      onClick={onClick}
      aria-label={`${collection.missionTitle} 채집 기록 보기`}
    >
      <SpecimenImage
        imageUrl={imageUrl}
        cropType={collection.cropType}
        status={collection.status}
        alt={collection.missionTitle}
        variant={isBook ? "bare" : "framed"}
        className={isBook ? "h-full w-full border-0 bg-transparent" : undefined}
      />
    </button>
  );
}
