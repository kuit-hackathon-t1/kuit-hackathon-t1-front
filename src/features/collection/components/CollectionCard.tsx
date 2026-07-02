import { useEffect, useState } from "react";
import { Link } from "react-router";

import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { getLocalImage } from "@/features/collection/lib/localImageStorage";
import type { Collection } from "@/features/collection/types/collection";
import Card from "@/shared/ui/Card";

export default function CollectionCard({ collection }: { collection: Collection }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadImage() {
      if (!collection.localImageId) return;
      const localImage = await getLocalImage(collection.localImageId);
      if (!localImage || cancelled) return;
      objectUrl = URL.createObjectURL(localImage.blob);
      setImageUrl(objectUrl);
    }

    void loadImage();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [collection.localImageId]);

  return (
    <Link to={`/collections/${collection.id}`}>
      <Card className="p-3">
        <SpecimenImage imageUrl={imageUrl} shape={collection.shape} status={collection.status} alt={collection.missionTitle} />
        <p className="mt-3 text-sm font-semibold text-neutral-950">{collection.missionTitle}</p>
        <p className="mt-1 text-xs text-neutral-500">{collection.status === "COMPLETED" ? "완료" : "실패"}</p>
      </Card>
    </Link>
  );
}
