import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/features/auth/types/auth";

type AuthState = {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  clearUser: () => void;
  setCurrentUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      setUser: (user) => set({ currentUser: user }),
      clearUser: () => set({ currentUser: null }),
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    },
  ),
);
