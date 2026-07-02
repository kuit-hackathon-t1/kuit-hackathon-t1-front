import { useMutation } from "@tanstack/react-query";

import { loginWithNickname } from "@/features/auth/api/authApi";

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginWithNickname,
  });
}
