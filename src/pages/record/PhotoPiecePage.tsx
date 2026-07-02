import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import { createCollection } from "@/features/collection/api/collectionApi";
import ShapeSelector from "@/features/collection/components/ShapeSelector";
import SpecimenImage from "@/features/collection/components/SpecimenImage";
import { saveLocalImage } from "@/features/collection/lib/localImageStorage";
import type { InsectShape } from "@/features/collection/types/collection";
import { completeMission } from "@/features/mission/api/missionApi";
import { useRecordDraftStore } from "@/features/record/stores/recordDraftStore";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import PageHeader from "@/shared/ui/PageHeader";

export default function PhotoPiecePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.currentUser);
  const draft = useRecordDraftStore((state) => state.draft);
  const clearDraft = useRecordDraftStore((state) => state.clearDraft);
  const imageFile = draft?.imageFile ?? null;
  const [shape, setShape] = useState<InsectShape>("BUTTERFLY");
  const [isSaving, setIsSaving] = useState(false);
  const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleSave() {
    if (!user || !draft || !imageFile) return;
    setIsSaving(true);
    const createdAt = new Date().toISOString();
    const localImageId = crypto.randomUUID();

    await saveLocalImage({ id: localImageId, blob: imageFile, createdAt });
    await createCollection({
      userId: user.userId,
      tripId: draft.tripId,
      missionId: draft.missionId,
      status: draft.status,
      memo: draft.memo,
      shape,
      localImageId,
    });
    await completeMission(draft.missionId, user.userId, draft.status);
    clearDraft();
    setIsSaving(false);
    navigate("/collections");
  }

  if (!draft || !imageFile) {
    return <Navigate to="/missions" replace />;
  }

  return (
    <>
      <PageHeader title="사진 조각 만들기" description="곤충 모양을 선택해 여행 채집통에 저장합니다." />
      <div className="space-y-4">
        <Card>
          <SpecimenImage imageUrl={previewUrl} shape={shape} status={draft.status} />
        </Card>
        <ShapeSelector value={shape} onChange={setShape} />
        <Button className="w-full" onClick={handleSave} disabled={isSaving}>
          채집통에 저장
        </Button>
      </div>
    </>
  );
}
