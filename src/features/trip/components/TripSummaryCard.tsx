import type { Trip } from "@/features/trip/types/trip";
import Card from "@/shared/ui/Card";

export default function TripSummaryCard({ trip }: { trip: Trip }) {
  return (
    <Card>
      <p className="text-xs font-semibold text-neutral-500">{trip.status}</p>
      <h2 className="mt-1 text-lg font-bold text-neutral-950">{trip.tripName}</h2>
      <p className="mt-2 text-sm text-neutral-600">{trip.region}</p>
      <p className="mt-1 text-sm text-neutral-500">
        {trip.startDate} - {trip.endDate}
      </p>
    </Card>
  );
}
