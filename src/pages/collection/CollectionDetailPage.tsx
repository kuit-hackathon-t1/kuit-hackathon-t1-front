import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { getLocalImage } from "@/features/collection/lib/localImageStorage";
import { useCollectionDetailQuery } from "@/features/collection/queries/useCollectionDetailQuery";
import Card from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";
import PageHeader from "@/shared/ui/PageHeader";

export default function CollectionDetailPage() {
  const { collectionId } = useParams();
  const user = useAuthStore((state) => state.currentUser);
  const numericCollectionId = collectionId ? Number(collectionId) : undefined;
  const collectionQuery = useCollectionDetailQuery(user?.userId, numericCollectionId);
  const collection = collectionQuery.data;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadImage() {
      setImageUrl(null);
      if (!collection?.imageId) return;
      const localImage = await getLocalImage(collection.imageId);
      if (!localImage || cancelled) return;
      objectUrl = URL.createObjectURL(localImage.blob);
      setImageUrl(objectUrl);
    }

    void loadImage();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [collection?.imageId]);

  if (collectionQuery.isLoading) {
    return <p className="text-sm text-neutral-500">기록을 불러오는 중...</p>;
  }

  if (!collection) {
    return <EmptyState title="기록을 찾을 수 없습니다" description="채집통에서 다시 선택해주세요." />;
  }

  return (
    <>
      <PageHeader title="기록 상세" description="채집 기록 상세" />
      <div className="space-y-4">
        <Card>
          <SpecimenImage
            imageUrl={imageUrl}
            cropType={collection.cropType}
            status={collection.status}
            alt={collection.missionTitle}
          />
        </Card>
        <Card>
          <p className="text-xs font-semibold text-emerald-700">{collection.status === "SUCCESS" ? "성공" : "실패"}</p>
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
              <dt className="font-semibold text-neutral-700">imageId</dt>
              <dd className="mt-1 break-all text-neutral-600">{collection.imageId ?? "저장된 이미지가 없습니다."}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}
