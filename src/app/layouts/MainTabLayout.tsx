import { NavLink, Outlet } from "react-router";

import { cn } from "@/shared/lib/cn";

export default function MainTabLayout() {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-stone-50 px-4 py-6 pb-24">
      <Outlet />

      <nav className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-neutral-200 bg-white/95 backdrop-blur">
        <div className="grid grid-cols-3">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              cn(
                "py-4 text-center text-sm font-medium text-neutral-500",
                isActive && "text-emerald-700",
              )
            }
          >
            홈
          </NavLink>

          <NavLink
            to="/missions"
            className={({ isActive }) =>
              cn(
                "py-4 text-center text-sm font-medium text-neutral-500",
                isActive && "text-emerald-700",
              )
            }
          >
            미션
          </NavLink>

          <NavLink
            to="/collections"
            className={({ isActive }) =>
              cn(
                "py-4 text-center text-sm font-medium text-neutral-500",
                isActive && "text-emerald-700",
              )
            }
          >
            기록
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
