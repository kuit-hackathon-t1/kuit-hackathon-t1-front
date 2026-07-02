import CollectionCard from "@/features/collection/components/CollectionCard";
import type { Collection } from "@/features/collection/types/collection";

export default function CollectionGrid({ collections }: { collections: Collection[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
