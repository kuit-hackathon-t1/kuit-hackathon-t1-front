import SpecimenTile from "@/features/collection/components/SpecimenTile";
import type { CollectionListItem } from "@/features/collection/types/collection";

type SpecimenLayerProps = {
  collections: CollectionListItem[];
  onSelectCollection: (collectionId: number) => void;
  limit?: number;
};

export default function SpecimenLayer({ collections, onSelectCollection, limit = 12 }: SpecimenLayerProps) {
  return (
    <>
      {collections.slice(0, limit).map((collection, index) => (
        <SpecimenTile
          key={collection.collectionId}
          collection={collection}
          index={index}
          variant="book"
          onClick={() => onSelectCollection(collection.collectionId)}
        />
      ))}
    </>
  );
}
