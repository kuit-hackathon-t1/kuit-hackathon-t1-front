import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRandomMission } from "@/features/mission/api/missionApi";
import { missionKeys } from "@/features/mission/queries/missionKeys";
import { tripKeys } from "@/features/trip/queries/tripKeys";

export function useRandomMissionMutation(userId?: number, tripId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (userId === undefined || tripId === undefined) throw new Error("Trip is required to create a mission.");
      return createRandomMission(userId, tripId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: missionKeys.list(tripId) });
      void queryClient.invalidateQueries({ queryKey: tripKeys.current(userId) });
      void queryClient.invalidateQueries({ queryKey: tripKeys.list(userId) });
    },
  });
}
