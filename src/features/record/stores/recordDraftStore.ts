import { create } from "zustand";

import type { RecordDraft } from "@/features/record/types/record";

type RecordDraftState = {
  draft: RecordDraft | null;
  setDraft: (draft: RecordDraft) => void;
  updateDraft: (draft: Partial<RecordDraft>) => void;
  clearDraft: () => void;
};

export const useRecordDraftStore = create<RecordDraftState>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  updateDraft: (partialDraft) =>
    set((state) => ({
      draft: state.draft ? { ...state.draft, ...partialDraft } : null,
    })),
  clearDraft: () => set({ draft: null }),
}));
