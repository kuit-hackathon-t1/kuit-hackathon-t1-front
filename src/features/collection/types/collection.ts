export type CollectionStatus = "SUCCESS" | "FAILURE";
export type CropType = "BUTTERFLY" | "BEETLE" | "DRAGONFLY";

export type CollectionListItem = {
  collectionId: number;
  userId?: number;
  tripId: number;
  missionId: number;
  missionTitle: string;
  missionDescription?: string;
  status: CollectionStatus;
  memo: string;
  cropType: CropType;
  imageId: string | null;
  region?: string;
  createdAt: string;
};

export type CollectionDetail = CollectionListItem;

export type CollectionCreatePayload = {
  tripId: number;
  missionId: number;
  memo: string;
  imageId: string;
  status: CollectionStatus;
  cropType: CropType;
  emotionTags: string[];
};

export type CollectionCreateResponse = CollectionDetail;

export type LocalImage = {
  id: string;
  blob: Blob;
  createdAt: string;
};

export type Collection = CollectionListItem;
