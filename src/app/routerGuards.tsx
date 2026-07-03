import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { useAuthStore } from "@/features/auth/stores/authStore";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";

export function RootRedirect() {
  const currentUser = useAuthStore((state) => state.currentUser);

  return <Navigate to={currentUser ? "/home" : "/onboarding"} replace />;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const currentUser = useAuthStore((state) => state.currentUser);

  return currentUser ? children : <Navigate to="/onboarding" replace />;
}

export function OnboardingRoute() {
  const currentUser = useAuthStore((state) => state.currentUser);

  return currentUser ? <Navigate to="/home" replace /> : <OnboardingPage />;
}
