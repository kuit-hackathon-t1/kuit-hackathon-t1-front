export const tripKeys = {
  all: ["trips"] as const,
  list: (userId?: number) => [...tripKeys.all, "list", userId] as const,
  current: (userId?: number) => [...tripKeys.all, "current", userId] as const,
  review: (userId?: number, tripId?: number) => [...tripKeys.all, "review", userId, tripId] as const,
};
