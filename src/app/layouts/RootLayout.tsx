import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900">
      <Outlet />
    </div>
  );
}
