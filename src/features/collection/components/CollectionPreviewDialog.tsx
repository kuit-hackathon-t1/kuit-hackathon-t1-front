import closeIcon from "@/assets/icons/close.svg";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useLocalImageUrl } from "@/features/collection/hooks/useLocalImageUrl";
import type { CollectionDetail } from "@/features/collection/types/collection";
import { getMissionCategoryMeta } from "@/features/mission/lib/missionCategory";
import { useMissionDetailQuery } from "@/features/mission/queries/useMissionDetailQuery";

type CollectionPreviewDialogProps = {
  collection: CollectionDetail | null;
  isLoading: boolean;
  onClose: () => void;
};

export default function CollectionPreviewDialog({ collection, isLoading, onClose }: CollectionPreviewDialogProps) {
  const userId = useAuthStore((state) => state.currentUser?.userId);
  const { imageUrl } = useLocalImageUrl(collection?.imageId);
  const missionQuery = useMissionDetailQuery(userId, collection?.missionId);
  const hasCollection = Boolean(collection);
  const categoryMeta = missionQuery.data?.category ? getMissionCategoryMeta(missionQuery.data.category) : null;
  const statusLabel = collection?.status === "SUCCESS" ? "성공" : "실패";
  const statusClassName =
    collection?.status === "SUCCESS" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600";
  const badgeLabel = categoryMeta?.label ?? statusLabel;
  const badgeClassName = categoryMeta?.className ?? statusClassName;

  return (
    <div className="fixed inset-0 z-[60] mx-auto w-full max-w-[430px] overflow-hidden bg-black">
      {imageUrl ? (
        <img className="absolute inset-0 h-full w-full object-cover" src={imageUrl} alt="" aria-hidden="true" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-400" />
      )}
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />

      <button
        className="absolute left-5 top-10 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur-md"
        type="button"
        aria-label="닫기"
        onClick={onClose}
      >
        <img className="h-4 w-4" src={closeIcon} alt="" aria-hidden="true" />
      </button>

      <section className="absolute inset-x-0 bottom-8 z-10 px-6">
        <div className="max-h-[40dvh] overflow-y-auto rounded-[22px] bg-white/80 p-5 shadow-card backdrop-blur-md">
          {isLoading ? (
            <p className="py-8 text-center text-sm font-medium text-gray-600">채집 조각을 불러오는 중...</p>
          ) : hasCollection && collection ? (
            <>
              <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${badgeClassName}`}>
                {badgeLabel}
              </span>
              <h2 className="mt-4 text-2xl font-bold leading-tight text-black-700">{collection.missionTitle}</h2>
              {collection.missionDescription ? (
                <p className="mt-3 line-clamp-2 text-sm leading-5 text-gray-600">{collection.missionDescription}</p>
              ) : null}
              <p className="mt-5 whitespace-pre-line text-sm leading-6 text-black-700">
                {collection.memo || "한줄 소감이 아직 없어요."}
              </p>
            </>
          ) : (
            <p className="py-8 text-center text-sm font-medium text-gray-600">채집 기록을 찾지 못했어요.</p>
          )}
        </div>
      </section>
    </div>
  );
}
