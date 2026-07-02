import type { InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-[10px] bg-gray-50 px-3 text-sm text-off outline-none placeholder:text-off",
        className,
      )}
      {...props}
    />
  );
}
