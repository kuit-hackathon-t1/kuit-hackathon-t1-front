import { NavLink, Outlet } from "react-router";

import { cn } from "@/shared/lib/cn";

export default function MainTabLayout() {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-orange-50 pb-20">
      <Outlet />

      <nav className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-orange-100 bg-white/95 backdrop-blur">
        <div className="grid grid-cols-2">
          <NavLink
            to="/missions"
            className={({ isActive }) =>
              cn(
                "py-4 text-center text-sm font-medium text-neutral-500",
                isActive && "text-orange-500",
              )
            }
          >
            미션
          </NavLink>

          <NavLink
            to="/island"
            className={({ isActive }) =>
              cn(
                "py-4 text-center text-sm font-medium text-neutral-500",
                isActive && "text-orange-500",
              )
            }
          >
            나의 섬
          </NavLink>
        </div>
      </nav>
    </div>
  );
}