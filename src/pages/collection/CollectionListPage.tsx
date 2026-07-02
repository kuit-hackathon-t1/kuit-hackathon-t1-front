import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import { getCollections } from "@/features/collection/api/collectionApi";
import CollectionGrid from "@/features/collection/components/CollectionGrid";
import type { Collection } from "@/features/collection/types/collection";
import { getActiveTrip } from "@/features/trip/api/tripApi";
import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";
import PageHeader from "@/shared/ui/PageHeader";

export default function CollectionListPage() {
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const [collections, setCollections] = useState<Collection[]>([]);
  const [title, setTitle] = useState("채집 기록");

  useEffect(() => {
    async function loadCollections() {
      if (!userId) return;
      const activeTrip = await getActiveTrip(userId);
      const nextCollections = activeTrip
        ? await getCollections({ tripId: activeTrip.id })
        : (await getCollections({})).filter((collection) => collection.userId === userId);
      setTitle(activeTrip ? `${activeTrip.title} 채집통` : "채집 기록");
      setCollections(nextCollections);
    }

    void loadCollections();
  }, [userId]);

  return (
    <>
      <PageHeader title={title} description="완료한 미션은 선명하게, 실패한 미션은 흐릿하게 보입니다." />
      {collections.length > 0 ? (
        <CollectionGrid collections={collections} />
      ) : (
        <EmptyState
          title="아직 채집 기록이 없습니다"
          description="미션을 시작하고 사진 조각을 저장하면 이곳에 모입니다."
          action={
            <Link to="/missions">
              <Button>미션으로 이동</Button>
            </Link>
          }
        />
      )}
    </>
  );
}
