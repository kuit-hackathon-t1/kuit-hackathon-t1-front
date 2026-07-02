import { Outlet } from "react-router";

export default function PlainLayout() {
  return (
    <main className="min-h-dvh px-5 py-6">
      <Outlet />
    </main>
  );
}