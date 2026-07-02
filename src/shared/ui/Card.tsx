import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("rounded-lg border border-neutral-200 bg-white p-4 shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}
