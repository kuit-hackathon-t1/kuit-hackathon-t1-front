import { createBrowserRouter } from "react-router";

import MainTabLayout from "@/app/layouts/MainTabLayout";
import PlainLayout from "@/app/layouts/PlainLayout";
import RootLayout from "@/app/layouts/RootLayout";
import { OnboardingRoute, RequireAuth, RootRedirect } from "@/app/routerGuards";
import CollectionListPage from "@/pages/collection/CollectionListPage";
import HomePage from "@/pages/home/HomePage";
import MissionListPage from "@/pages/mission/MissionListPage";
import RecordCreatePage from "@/pages/record/RecordCreatePage";
import TripCreatePage from "@/pages/trip/TripCreatePage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PlainLayout />,
        children: [
          {
            path: "/",
            element: <RootRedirect />,
          },
          {
            path: "/onboarding",
            element: <OnboardingRoute />,
          },
          {
            path: "/trips/new",
            element: (
              <RequireAuth>
                <TripCreatePage />
              </RequireAuth>
            ),
          },
          {
            path: "/records/new",
            element: (
              <RequireAuth>
                <RecordCreatePage />
              </RequireAuth>
            ),
          },
        ],
      },
      {
        element: <MainTabLayout />,
        children: [
          {
            path: "home",
            element: (
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            ),
          },
          {
            path: "/missions",
            element: (
              <RequireAuth>
                <MissionListPage />
              </RequireAuth>
            ),
          },
          {
            path: "/collections",
            element: (
              <RequireAuth>
                <CollectionListPage />
              </RequireAuth>
            ),
          },
        ],
      },
    ],
  },
]);
