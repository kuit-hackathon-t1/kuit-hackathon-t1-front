import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("rounded-[20px] border border-black bg-white p-4", className)} {...props}>
      {children}
    </div>
  );
}
