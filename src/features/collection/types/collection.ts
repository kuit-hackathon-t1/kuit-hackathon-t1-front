export type InsectShape = "BUTTERFLY" | "BEETLE" | "DRAGONFLY";
export type CollectionStatus = "COMPLETED" | "FAILED";

export type Collection = {
  id: number;
  userId: number;
  tripId: number;
  missionId: number;
  missionTitle: string;
  missionDescription?: string;
  status: CollectionStatus;
  memo: string;
  shape: InsectShape;
  imageUrl: string | null;
  imageKey: string | null;
  localImageId: string | null;
  region?: string;
  createdAt: string;
};

export type LocalImage = {
  id: string;
  blob: Blob;
  createdAt: string;
};

export type CollectionCreatePayload = {
  userId: number;
  tripId: number;
  missionId: number;
  status: CollectionStatus;
  memo: string;
  shape: InsectShape;
  localImageId: string;
};
