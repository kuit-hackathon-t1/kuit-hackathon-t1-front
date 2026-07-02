export type CompanionType = "ALONE" | "FRIEND" | "COUPLE" | "ETC";
export type TripStatus = "ACTIVE" | "ENDED";
export type TripMood = "EMOTIONAL" | "WANDERING" | "LOCAL" | "COURAGE";

export type MissionSummary = {
  totalCount: number;
  activeCount: number;
  successCount: number;
  failedCount: number;
};

export type CollectionSummary = {
  totalCount: number;
  successCount: number;
  failedCount: number;
};

export type CurrentTrip = {
  tripId: number;
  tripName: string;
  region: string;
  startDate: string;
  endDate: string;
  companionType: CompanionType;
  mood: TripMood;
  status: TripStatus;
  missionSummary: MissionSummary;
  collectionSummary: CollectionSummary;
};

export type CurrentTripResponse = {
  hasActiveTrip: boolean;
  trip: CurrentTrip | null;
};

export type TripCreatePayload = {
  tripName: string;
  region: string;
  startDate: string;
  endDate: string;
  companionType: CompanionType;
  mood: TripMood;
};

export type TripCreateResponse = {
  tripId: number;
  status: "ACTIVE";
  createdAt: string;
};

export type TripEndResponse = {
  tripId: number;
  status: "ENDED";
  updatedAt: string;
};

export type TripReview = {
  tripId: number;
  tripName: string;
  region: string;
  startDate: string;
  endDate: string;
  companionType: CompanionType;
  mood: TripMood;
  status: "ENDED";
  successMissionCount: number;
  failedMissionCount: number;
  totalMissionCount: number;
  totalCollectionCount: number;
};

export type Trip = CurrentTrip;
