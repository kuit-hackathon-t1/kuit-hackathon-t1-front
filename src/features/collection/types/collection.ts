export type CollectionStatus = "SUCCESS" | "FAILURE";
export type CropType = "BUTTERFLY" | "BEETLE" | "DRAGONFLY";

export type CollectionListItem = {
  collectionId: number;
  imageId: string | null;
  missionTitle: string;
  cropType: CropType;
  status: CollectionStatus;
  createdAt: string;
};

export type CollectionDetail = CollectionListItem & {
  tripId: number;
  missionId: number;
  missionDescription?: string;
  memo: string;
  emotionTags: string[];
};

export type CollectionCreatePayload = {
  missionId: number;
  tripId: number;
  memo: string;
  imageId: string;
  status: CollectionStatus;
  cropType: CropType;
  emotionTags: string[];
};

export type CollectionCreateResponse = {
  collectionId: number;
  missionId: number;
  missionStatus: CollectionStatus;
  createdAt: string;
};

export type CollectionListResponse = {
  tripId: number;
  collections: CollectionListItem[];
};

export type LocalImage = {
  id: string;
  blob: Blob;
  createdAt: string;
};

export type Collection = CollectionListItem;
