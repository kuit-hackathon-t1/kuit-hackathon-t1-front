import type { User } from "@/features/auth/types/auth";

const USERS_KEY = "mock-users";

function readUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as User[]) : [];
}

function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function checkNickname(nickname: string): Promise<{ available: boolean }> {
  const normalized = nickname.trim();
  const users = readUsers();
  return { available: !users.some((user) => user.nickname === normalized) };
}

export async function loginWithNickname(nickname: string): Promise<User> {
  const normalized = nickname.trim();
  const users = readUsers();
  const existingUser = users.find((user) => user.nickname === normalized);
  if (existingUser) return existingUser;

  const user: User = {
    userId: Date.now(),
    nickname: normalized,
  };

  writeUsers([...users, user]);
  return user;
}
