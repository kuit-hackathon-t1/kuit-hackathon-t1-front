import type { InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-emerald-700",
        className,
      )}
      {...props}
    />
  );
}
