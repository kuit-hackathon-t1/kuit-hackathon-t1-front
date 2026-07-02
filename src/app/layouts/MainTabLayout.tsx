import { Outlet, NavLink } from "react-router";

import { cn } from "@/shared/lib/cn";

export default function MainTabLayout() {
  return (
    <div className="relative min-h-dvh pb-20">
      <main className="px-5 py-6">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-neutral-200 bg-white/95 backdrop-blur">
        <div className="grid h-16 grid-cols-3">
          <NavLink
            to="/missions"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium",
                isActive ? "text-emerald-700" : "text-neutral-500",
              )
            }
          >
            <span aria-hidden="true">◎</span>
            미션
          </NavLink>

          <NavLink
            to="/home"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium",
                isActive ? "text-emerald-700" : "text-neutral-500",
              )
            }
          >
            <span aria-hidden="true">⌂</span>
            메인홈
          </NavLink>

          <NavLink
            to="/collections"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium",
                isActive ? "text-emerald-700" : "text-neutral-500",
              )
            }
          >
            <span aria-hidden="true">▣</span>
            채집 기록
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
