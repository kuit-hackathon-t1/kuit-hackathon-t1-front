import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { useLocalImageUrl } from "@/features/collection/hooks/useLocalImageUrl";
import type { CollectionListItem } from "@/features/collection/types/collection";
import { cn } from "@/shared/lib/cn";

type SpecimenTileProps = {
  collection: CollectionListItem;
  index: number;
  onClick: () => void;
};

const positions = [
  "left-[18%] top-[22%] rotate-[-8deg]",
  "left-[54%] top-[24%] rotate-[7deg]",
  "left-[28%] top-[50%] rotate-[5deg]",
  "left-[64%] top-[54%] rotate-[-6deg]",
  "left-[42%] top-[36%] rotate-[2deg]",
  "left-[12%] top-[60%] rotate-[10deg]",
];

export default function SpecimenTile({ collection, index, onClick }: SpecimenTileProps) {
  const { imageUrl } = useLocalImageUrl(collection.imageId);

  return (
    <button
      className={cn(
        "absolute h-16 w-16 rounded-2xl bg-white/90 p-1 shadow-card transition-transform hover:scale-105",
        positions[index % positions.length],
      )}
      type="button"
      onClick={onClick}
      aria-label={`${collection.missionTitle} 채집 기록 보기`}
    >
      <SpecimenImage imageUrl={imageUrl} cropType={collection.cropType} status={collection.status} alt={collection.missionTitle} />
    </button>
  );
}
