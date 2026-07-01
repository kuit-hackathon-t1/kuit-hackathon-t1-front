import { createBrowserRouter } from "react-router";

import MainTabLayout from "@/app/layouts/MainTabLayout";
import PlainLayout from "@/app/layouts/PlainLayout";
import RootLayout from "@/app/layouts/RootLayout";

import IslandPage from "@/pages/IslandPage";
import LandingPage from "@/pages/LandingPage";
import MissionBoardPage from "@/pages/MissionBoardPage";
import MissionRecommendPage from "@/pages/MissionRecommendPage";
import TravelStylePage from "@/pages/TravelStylePage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PlainLayout />,
        children: [
          {
            path: "/",
            element: <LandingPage />,
          },
          {
            path: "/travel-style",
            element: <TravelStylePage />,
          },
          {
            path: "/recommend",
            element: <MissionRecommendPage />,
          },
        ],
      },
      {
        element: <MainTabLayout />,
        children: [
          {
            path: "/missions",
            element: <MissionBoardPage />,
          },
          {
            path: "/island",
            element: <IslandPage />,
          },
        ],
      },
    ],
  },
]);