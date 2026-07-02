import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { useLocalImageUrl } from "@/features/collection/hooks/useLocalImageUrl";
import type { CollectionDetail } from "@/features/collection/types/collection";
import Card from "@/shared/ui/Card";

type CollectionPreviewDialogProps = {
  collection: CollectionDetail | null;
  isLoading: boolean;
  onClose: () => void;
};

export default function CollectionPreviewDialog({ collection, isLoading, onClose }: CollectionPreviewDialogProps) {
  const { imageUrl } = useLocalImageUrl(collection?.imageId);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] mx-auto flex w-full max-w-[430px] items-end justify-center bg-black/20 px-5 pb-24 pt-6">
      <Card className="max-h-[76dvh] w-full max-w-[360px] overflow-y-auto rounded-[28px] border-gray-200 bg-white p-5 shadow-card">
        <button className="text-2xl text-gray-500" type="button" aria-label="닫기" onClick={onClose}>
          ×
        </button>
        {isLoading ? (
          <p className="mt-8 text-center text-sm text-gray-600">채집 조각을 불러오는 중...</p>
        ) : collection ? (
          <>
            <div className="mx-auto mt-8 w-48">
              <SpecimenImage imageUrl={imageUrl} cropType={collection.cropType} status={collection.status} alt={collection.missionTitle} />
            </div>
            <div className="mt-6 rounded-[22px] bg-white p-4 shadow-card">
              <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600">
                {collection.status === "SUCCESS" ? "성공" : "실패"}
              </span>
              <h2 className="mt-3 text-2xl font-bold leading-9 text-black-700">{collection.missionTitle}</h2>
              <p className="mt-3 text-xs text-gray-500">{collection.createdAt}</p>
              <p className="mt-6 text-sm leading-7 text-black-700">{collection.memo || "한줄 소감이 아직 없어요."}</p>
            </div>
          </>
        ) : (
          <p className="mt-8 text-center text-sm text-gray-600">채집 기록을 찾지 못했어요.</p>
        )}
      </Card>
    </div>
  );
}
