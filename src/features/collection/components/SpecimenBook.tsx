import SpecimenLayer from "@/features/collection/components/SpecimenLayer";
import type { CollectionListItem } from "@/features/collection/types/collection";

type SpecimenBookProps = {
  collections: CollectionListItem[];
  onSelectCollection: (collectionId: number) => void;
};

export default function SpecimenBook({ collections, onSelectCollection }: SpecimenBookProps) {
  return (
    <div className="relative mx-auto mt-5 h-72 w-full max-w-[410px] overflow-hidden text-sm font-semibold text-primary">
      <img
        className="absolute inset-0 h-full w-full object-contain"
        src="/images/home/open-book.png"
        alt="펼쳐진 도감"
      />
      {collections.length > 0 ? (
        <div className="absolute bottom-[15%] left-[9%] right-[9%] top-[12%] overflow-hidden">
          <SpecimenLayer collections={collections} onSelectCollection={onSelectCollection} limit={12} />
        </div>
      ) : (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2">
          아직 채집된 조각이 없어요
        </span>
      )}
    </div>
  );
}
