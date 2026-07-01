import { Outlet } from "react-router";

export default function PlainLayout() {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-orange-50">
      <Outlet />
    </div>
  );
}