import { Outlet, NavLink, useLocation } from "react-router";

import homeIcon from "@/assets/icons/home.svg";
import missionIcon from "@/assets/icons/mission.svg";
import recordIcon from "@/assets/icons/record.svg";

const tabs = [
  { to: "/missions", label: "미션", icon: missionIcon },
  { to: "/home", label: "메인홈", icon: homeIcon },
  { to: "/collections", label: "채집 기록", icon: recordIcon },
];

export default function MainTabLayout() {
  const location = useLocation();
  const hideBottomNav =
    location.pathname === "/missions" && new URLSearchParams(location.search).get("draw") === "1";

  return (
    <div className="relative h-dvh overflow-hidden bg-white">
      <main className={`h-full overflow-y-auto ${hideBottomNav ? "" : "pb-16"}`}>
        <Outlet />
      </main>

      {!hideBottomNav ? (
        <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-neutral-200 bg-white/95 backdrop-blur">
          <div className="grid h-16 grid-cols-3">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-neutral-500"
              >
                {({ isActive }) => (
                  <>
                    <img
                      className="h-5 w-5"
                      src={tab.icon}
                      alt=""
                      style={{
                        filter: isActive
                          ? "brightness(0) saturate(100%) invert(35%) sepia(96%) saturate(962%) hue-rotate(126deg) brightness(88%) contrast(101%)"
                          : "brightness(0) saturate(100%) invert(61%) sepia(5%) saturate(138%) hue-rotate(22deg) brightness(93%) contrast(89%)",
                      }}
                      aria-hidden="true"
                    />
                    {tab.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
