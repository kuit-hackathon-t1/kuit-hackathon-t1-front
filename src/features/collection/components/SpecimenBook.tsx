import SpecimenLayer from "@/features/collection/components/SpecimenLayer";
import type { CollectionListItem } from "@/features/collection/types/collection";

type SpecimenBookProps = {
  collections: CollectionListItem[];
  onSelectCollection: (collectionId: number) => void;
};

export default function SpecimenBook({ collections, onSelectCollection }: SpecimenBookProps) {
  return (
    <div
      className="relative mt-10 flex h-64 items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-primary/30 bg-white text-sm font-semibold text-primary shadow-card"
      style={{
        backgroundImage: "url('/images/home/open-book.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {collections.length > 0 ? (
        <SpecimenLayer collections={collections} onSelectCollection={onSelectCollection} />
      ) : (
        <span className="rounded-full bg-white/90 px-4 py-2">아직 채집된 조각이 없어요</span>
      )}
    </div>
  );
}
