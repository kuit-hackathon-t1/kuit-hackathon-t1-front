export type CompanionType = "ALONE" | "FRIEND" | "COUPLE" | "ETC";
export type TripStatus = "ACTIVE" | "ENDED";
export type TripMood = "EMOTIONAL" | "WANDERING" | "LOCAL" | "COURAGE";

export type TripSummary = {
  totalCount: number;
  completedCount: number;
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
  missionSummary: TripSummary;
  collectionSummary: TripSummary;
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

export type TripReview = {
  trip: CurrentTrip;
  totalCollectionCount: number;
  successMissionCount: number;
  failedMissionCount: number;
};

export type Trip = CurrentTrip;
