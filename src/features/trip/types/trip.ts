export type CompanionType = "ALONE" | "FRIEND" | "COUPLE" | "ETC";
export type TripStatus = "ACTIVE" | "ENDED";

export type Trip = {
  id: number;
  userId: number;
  title: string;
  region: string;
  startDate: string;
  endDate: string;
  companionType: CompanionType;
  status: TripStatus;
  createdAt: string;
};

export type TripCreatePayload = {
  userId: number;
  title: string;
  region: string;
  startDate: string;
  endDate: string;
  companionType: CompanionType;
};

export type TripReview = {
  trip: Trip;
  totalCollections: number;
  completedCount: number;
  failedCount: number;
};
