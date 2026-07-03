import moodCourageIcon from "@/assets/icons/mood-courage.svg";
import moodEmotionalIcon from "@/assets/icons/mood-emotional.svg";
import moodLocalIcon from "@/assets/icons/mood-local.svg";
import moodWanderingIcon from "@/assets/icons/mood-wandering.svg";
import type { TripMood } from "@/features/trip/types/trip";

type TripMoodMeta = {
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
};

export const tripMoodMeta = {
  EMOTIONAL: {
    label: "감성 남기기",
    shortLabel: "감성",
    description: "여행의 분위기를 사진과 문장으로 남겨요",
    icon: moodEmotionalIcon,
  },
  WANDERING: {
    label: "헤매기",
    shortLabel: "헤매기",
    description: "계획에서 벗어난 순간을 중심으로 채집해요",
    icon: moodWanderingIcon,
  },
  LOCAL: {
    label: "지역 느끼기",
    shortLabel: "지역",
    description: "계획에서 벗어난 순간을 중심으로 채집해요",
    icon: moodLocalIcon,
  },
  COURAGE: {
    label: "조금 용기내기",
    shortLabel: "용기",
    description: "평소보다 지나쳤을 순간에 한걸음 다가가요",
    icon: moodCourageIcon,
  },
} satisfies Record<TripMood, TripMoodMeta>;

export function getTripMoodMeta(mood: TripMood) {
  return tripMoodMeta[mood];
}
