import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { getCollection } from "@/features/collection/api/collectionApi";
import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { getLocalImage } from "@/features/collection/lib/localImageStorage";
import type { Collection } from "@/features/collection/types/collection";
import Card from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";
import PageHeader from "@/shared/ui/PageHeader";

export default function CollectionDetailPage() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    async function loadCollection() {
      if (!collectionId) return;
      const nextCollection = await getCollection(Number(collectionId));
      setCollection(nextCollection);
      if (!nextCollection?.localImageId) return;
      const localImage = await getLocalImage(nextCollection.localImageId);
      if (!localImage) return;
      objectUrl = URL.createObjectURL(localImage.blob);
      setImageUrl(objectUrl);
    }

    void loadCollection();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [collectionId]);

  if (!collection) {
    return <EmptyState title="기록을 찾을 수 없습니다" description="채집통에서 다시 선택해주세요." />;
  }

  return (
    <>
      <PageHeader title="기록 상세" description={collection.region ?? "지역 정보 없음"} />
      <div className="space-y-4">
        <Card>
          <SpecimenImage imageUrl={imageUrl} shape={collection.shape} status={collection.status} alt={collection.missionTitle} />
        </Card>
        <Card>
          <p className="text-xs font-semibold text-emerald-700">{collection.status === "COMPLETED" ? "완료" : "실패"}</p>
          <h1 className="mt-2 text-xl font-bold text-neutral-950">{collection.missionTitle}</h1>
          {collection.missionDescription ? <p className="mt-3 text-sm leading-6 text-neutral-600">{collection.missionDescription}</p> : null}
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-neutral-700">한줄평</dt>
              <dd className="mt-1 text-neutral-600">{collection.memo || "작성된 한줄평이 없습니다."}</dd>
            </div>
            <div>
              <dt className="font-semibold text-neutral-700">날짜</dt>
              <dd className="mt-1 text-neutral-600">{new Date(collection.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="font-semibold text-neutral-700">localImageId</dt>
              <dd className="mt-1 break-all text-neutral-600">{collection.localImageId}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}
