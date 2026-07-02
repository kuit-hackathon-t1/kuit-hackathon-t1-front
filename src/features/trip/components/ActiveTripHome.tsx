import { Link, useNavigate } from "react-router";

import { useMissionListQuery } from "@/features/mission/queries/useMissionListQuery";
import type { Trip } from "@/features/trip/types/trip";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";

type ActiveTripHomeProps = {
  trip: Trip;
  userId?: number;
  onEndTrip: () => Promise<Trip>;
};

export default function ActiveTripHome({ trip, userId, onEndTrip }: ActiveTripHomeProps) {
  const navigate = useNavigate();
  const activeMissionQuery = useMissionListQuery(userId, trip.tripId, "ACTIVE");
  const activeMissions = activeMissionQuery.data ?? [];

  async function handleEndTrip() {
    const endedTrip = await onEndTrip();
    navigate(`/trips/${endedTrip.tripId}/review`);
  }

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm font-medium text-emerald-700">진행 중인 여행</p>
        <h2 className="mt-2 text-xl font-bold text-neutral-950">{trip.tripName}</h2>
        <p className="mt-2 text-sm text-neutral-600">{trip.region}</p>
        <p className="mt-1 text-sm text-neutral-500">
          {trip.startDate} - {trip.endDate}
        </p>
      </Card>

      {activeMissions.length > 0 ? (
        <Card>
          <p className="text-sm font-medium text-neutral-700">진행 중인 미션</p>
          <div className="mt-3 space-y-2">
            {activeMissions.map((mission) => (
              <Link
                key={mission.missionId}
                to={`/missions/${mission.missionId}/progress`}
                className="block rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700"
              >
                {mission.title}
              </Link>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="grid gap-2">
        <Link to="/missions">
          <Button className="w-full">랜덤 미션 뽑기</Button>
        </Link>
        <Link to="/collections">
          <Button className="w-full" variant="secondary">
            채집통 보기
          </Button>
        </Link>
        <Button className="w-full" variant="ghost" onClick={handleEndTrip}>
          여행 종료
        </Button>
      </div>
    </div>
  );
}
