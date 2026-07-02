import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { useLocalImageUrl } from "@/features/collection/hooks/useLocalImageUrl";
import type { CollectionListItem } from "@/features/collection/types/collection";

type ShelfSpecimenProps = {
  collection: CollectionListItem;
  onClick: () => void;
};

export default function ShelfSpecimen({ collection, onClick }: ShelfSpecimenProps) {
  const { imageUrl } = useLocalImageUrl(collection.imageId);

  return (
    <button
      className="flex h-30 w-16 shrink-0 flex-col items-center justify-between rounded-md border border-primary bg-[#FFFFF7] px-1 py-2 text-[11px] font-semibold text-black-950 shadow-sm"
      type="button"
      onClick={onClick}
    >
      <span className="line-clamp-4 [writing-mode:vertical-rl]">{collection.missionTitle}</span>
      <div className="h-8 w-8">
        <SpecimenImage imageUrl={imageUrl} cropType={collection.cropType} status={collection.status} alt={collection.missionTitle} />
      </div>
    </button>
  );
}
