import type { User } from "@/features/auth/types/auth";
import { endpoints } from "@/shared/api/endpoints";
import { fetchClient } from "@/shared/api/fetchClient";

export async function checkNickname(nickname: string): Promise<{ available: boolean }> {
  const normalized = nickname.trim();

  // Deprecated: the server has no nickname availability API yet.
  return { available: normalized.length >= 2 };
}

export async function loginWithNickname(nickname: string): Promise<User> {
  const normalized = nickname.trim();
  return fetchClient.post<User>(endpoints.auth.login, { nickname: normalized });
}
