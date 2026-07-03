import { Outlet, NavLink } from "react-router";

import homeIcon from "@/assets/icons/home.svg";
import missionIcon from "@/assets/icons/mission.svg";
import recordIcon from "@/assets/icons/record.svg";
import { cn } from "@/shared/lib/cn";

const tabs = [
  { to: "/missions", label: "미션", icon: missionIcon },
  { to: "/home", label: "메인홈", icon: homeIcon },
  { to: "/collections", label: "채집 기록", icon: recordIcon },
];

export default function MainTabLayout() {
  return (
    <div className="relative h-dvh overflow-hidden bg-white">
  <main className="h-full overflow-y-auto pb-16">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-neutral-200 bg-white/95 backdrop-blur">
        <div className="grid h-16 grid-cols-3">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 text-xs font-medium",
                  isActive ? "text-emerald-700" : "text-neutral-500",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <img className={cn("h-5 w-5", isActive ? "opacity-100" : "opacity-55")} src={tab.icon} alt="" aria-hidden="true" />
                  {tab.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
