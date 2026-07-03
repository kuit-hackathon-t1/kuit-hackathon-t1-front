import CollectionCard from "@/features/collection/components/CollectionCard";
import type { CollectionListItem } from "@/features/collection/types/collection";

export default function CollectionGrid({ collections }: { collections: CollectionListItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {collections.map((collection) => (
        <CollectionCard key={collection.collectionId} collection={collection} />
      ))}
    </div>
  );
}
