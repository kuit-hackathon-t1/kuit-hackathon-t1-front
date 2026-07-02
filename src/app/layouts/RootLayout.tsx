import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="min-h-dvh bg-neutral-100">
      <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-white shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}