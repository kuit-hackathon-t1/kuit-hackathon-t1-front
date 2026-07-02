import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export type TabItem<T extends string> = {
  value: T;
  label: string;
};

type TabsProps<T extends string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function Tabs<T extends string>({ items, value, onChange }: TabsProps<T>) {
  return (
    <div className="grid rounded-lg bg-neutral-100 p-1" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={cn(
            "min-h-9 rounded-md px-2 text-sm font-medium text-neutral-500",
            value === item.value && "bg-white text-neutral-900 shadow-sm",
          )}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function TabPanel({ children }: { children: ReactNode }) {
  return <div className="mt-4">{children}</div>;
}
