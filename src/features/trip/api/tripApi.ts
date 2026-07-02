import type { CurrentTripResponse, Trip, TripCreatePayload, TripReview } from "@/features/trip/types/trip";
import { endpoints } from "@/shared/api/endpoints";
import { fetchClient } from "@/shared/api/fetchClient";

export async function getCurrentTrip(userId: number): Promise<CurrentTripResponse> {
  return fetchClient.get<CurrentTripResponse>(endpoints.trips.current, { userId });
}

export async function getActiveTrip(userId: number): Promise<Trip | null> {
  const response = await getCurrentTrip(userId);
  return response.hasActiveTrip ? response.trip : null;
}

export async function createTrip(userId: number, payload: TripCreatePayload): Promise<Trip> {
  return fetchClient.post<Trip>(endpoints.trips.create, payload, { userId });
}

export async function endTrip(userId: number, tripId: number): Promise<Trip> {
  return fetchClient.patch<Trip>(endpoints.trips.end(tripId), undefined, { userId });
}

export async function getTripReview(userId: number, tripId: number): Promise<TripReview> {
  return fetchClient.get<TripReview>(endpoints.trips.review(tripId), { userId });
}
