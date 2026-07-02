import type { Trip, TripCreatePayload, TripReview } from "@/features/trip/types/trip";
import { getCollections } from "@/features/collection/api/collectionApi";

const TRIPS_KEY = "mock-trips";

function readTrips(): Trip[] {
  const raw = localStorage.getItem(TRIPS_KEY);
  return raw ? (JSON.parse(raw) as Trip[]) : [];
}

function writeTrips(trips: Trip[]) {
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

export async function getActiveTrip(userId: number): Promise<Trip | null> {
  return readTrips().find((trip) => trip.userId === userId && trip.status === "ACTIVE") ?? null;
}

export async function createTrip(payload: TripCreatePayload): Promise<Trip> {
  const trips = readTrips();
  const now = new Date().toISOString();
  const trip: Trip = {
    id: Date.now(),
    status: "ACTIVE",
    createdAt: now,
    ...payload,
  };

  const nextTrips = trips
    .map((item) =>
      item.userId === payload.userId && item.status === "ACTIVE"
        ? { ...item, status: "ENDED" as const }
        : item,
    )
    .concat(trip);

  writeTrips(nextTrips);
  return trip;
}

export async function getTrips(userId: number): Promise<Trip[]> {
  return readTrips().filter((trip) => trip.userId === userId);
}

export async function endTrip(tripId: number, userId: number): Promise<Trip> {
  const trips = readTrips();
  const target = trips.find((trip) => trip.id === tripId && trip.userId === userId);

  if (!target) {
    throw new Error("Trip not found");
  }

  const endedTrip: Trip = { ...target, status: "ENDED" };
  writeTrips(trips.map((trip) => (trip.id === tripId ? endedTrip : trip)));
  return endedTrip;
}

export async function getTripReview(tripId: number, userId: number): Promise<TripReview | null> {
  const trip = readTrips().find((item) => item.id === tripId && item.userId === userId);
  if (!trip) return null;

  const collections = await getCollections({ tripId });

  return {
    trip,
    totalCollections: collections.length,
    completedCount: collections.filter((item) => item.status === "COMPLETED").length,
    failedCount: collections.filter((item) => item.status === "FAILED").length,
  };
}
