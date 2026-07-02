import { createBrowserRouter } from "react-router";

import MainTabLayout from "@/app/layouts/MainTabLayout";
import PlainLayout from "@/app/layouts/PlainLayout";
import RootLayout from "@/app/layouts/RootLayout";
import { OnboardingRoute, RequireAuth, RootRedirect } from "@/app/routerGuards";
import CollectionDetailPage from "@/pages/collection/CollectionDetailPage";
import CollectionListPage from "@/pages/collection/CollectionListPage";
import HomePage from "@/pages/home/HomePage";
import MissionListPage from "@/pages/mission/MissionListPage";
import MissionProgressPage from "@/pages/mission/MissionProgressPage";
import PhotoPiecePage from "@/pages/record/PhotoPiecePage";
import RecordCreatePage from "@/pages/record/RecordCreatePage";
import TripCreatePage from "@/pages/trip/TripCreatePage";
import TripReviewPage from "@/pages/trip/TripReviewPage";

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
            path: "/missions/:missionId/progress",
            element: (
              <RequireAuth>
                <MissionProgressPage />
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
          {
            path: "/photo-piece",
            element: (
              <RequireAuth>
                <PhotoPiecePage />
              </RequireAuth>
            ),
          },
          {
            path: "/collections/:collectionId",
            element: (
              <RequireAuth>
                <CollectionDetailPage />
              </RequireAuth>
            ),
          },
          {
            path: "/trips/:tripId/review",
            element: (
              <RequireAuth>
                <TripReviewPage />
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
