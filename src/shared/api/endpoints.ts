function withQuery(path: string, query: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export const endpoints = {
  auth: {
    login: "/api/v1/login",
  },
  trips: {
    current: "/api/v1/trips/current",
    create: "/api/v1/trips",
    end: (tripId: number) => `/api/v1/trips/${tripId}/end`,
    review: (tripId: number) => `/api/v1/trips/${tripId}/review`,
  },
  missions: {
    random: (tripId: number) => `/api/v1/trips/${tripId}/missions/random`,
    list: (tripId: number, status?: string) => withQuery(`/api/v1/trips/${tripId}/missions`, { status }),
    detail: (missionId: number) => `/api/v1/missions/${missionId}`,
    start: (missionId: number) => `/api/v1/missions/${missionId}/start`,
  },
  collections: {
    create: "/api/v1/collections",
    list: (tripId: number, status?: string) => withQuery("/api/v1/collections", { tripId, status }),
    detail: (collectionId: number) => `/api/v1/collections/${collectionId}`,
  },
};
