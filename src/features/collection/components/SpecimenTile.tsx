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
  "left-[7%] top-[8%] h-16 w-16 rotate-[-10deg]",
  "left-[62%] top-[8%] h-16 w-16 rotate-[8deg]",
  "left-[25%] top-[24%] h-[68px] w-[68px] rotate-[7deg]",
  "left-[80%] top-[24%] h-14 w-14 rotate-[-8deg]",
  "left-[10%] top-[47%] h-[68px] w-[68px] rotate-[9deg]",
  "left-[63%] top-[46%] h-[68px] w-[68px] rotate-[-6deg]",
  "left-[30%] top-[50%] h-16 w-16 rotate-[-9deg]",
  "left-[80%] top-[52%] h-14 w-14 rotate-[10deg]",
  "left-[7%] top-[68%] h-14 w-14 rotate-[8deg]",
  "left-[27%] top-[66%] h-16 w-16 rotate-[-5deg]",
  "left-[61%] top-[68%] h-14 w-14 rotate-[7deg]",
  "left-[78%] top-[66%] h-16 w-16 rotate-[-6deg]",
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
