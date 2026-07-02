import type { ReactNode } from "react";

import Card from "@/shared/ui/Card";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="text-center">
      <p className="text-base font-semibold text-neutral-900">{title}</p>
      {description ? <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}
