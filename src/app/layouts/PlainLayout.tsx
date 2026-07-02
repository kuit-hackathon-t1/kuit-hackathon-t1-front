import { Outlet } from "react-router";

export default function PlainLayout() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-stone-50 px-4 py-6">
      <Outlet />
    </main>
  );
}
